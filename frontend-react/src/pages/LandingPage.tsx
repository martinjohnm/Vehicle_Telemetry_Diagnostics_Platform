import { useEffect, useState } from "react"
import { SignalingManager } from "../utils/SignalingManager"
import Histogram from "../components/Landing/Histogram";
import { DensityHeatmap } from "../components/Landing/DensityHeatmap";
import { MapContainer, TileLayer } from "react-leaflet";
import type { AnalyticsData } from "../types/car";
// import type { AnalyticsTypes } from "../types/out"



export interface CarData {
  type: string;
  id: string;
  city: string;
  speed: number;
  latitude: number;
  longitude: number;
  fuel_level: number;
  direction: number;
  status: string;
  timestamp: number;
}


type SpeedBin = { range: string; count: number };


export const LandingPage = () => {



    // const [analytics, setAnalytics] = useState<AnalyticsTypes[]>(["top_ten_car_by_speed"])
    const position: [number, number] = [50.8295, 12.9150];

    const [top_ten_carsdata_from_ws, setTopTenCarsData] = useState<[string, CarData][]>([])
    const [speed_histogram, setSpeedHistogram] = useState<SpeedBin[]>([])

      useEffect(() => {


        // setAnalytics(["top_ten_car_by_speed"])


        const init = async () => {
    
          SignalingManager.getInstance().sendMessage({"method" : "SUBSCRIBE_ANALYTICS", "params" : ["top_ten_car_by_speed"]})
    
          SignalingManager.getInstance().registerCallBack("ANALYTICS", (data: AnalyticsData) => {
          
            setTopTenCarsData(data.top_ten_cars as [string, CarData][])
            setSpeedHistogram(data.speed_histogram as SpeedBin[])
        
          }, `ANALYTICS-TOP_TEN_CARS`)
    
          return () => {
            SignalingManager.getInstance().sendMessage({"method" : "UNSUBSCRIBE_ANALYTICS", "params" : ["top_ten_car_by_speed"]})
            SignalingManager.getInstance().deregisterCallBack("ANALYTICS", `ANALYTICS-TOP_TEN_CARS`)
          }
    
        }
    
        init()
      }, [top_ten_carsdata_from_ws])
    

      console.log(top_ten_carsdata_from_ws);
      
    
    return <div className="p-2">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Telematics dashboard</p>
        </div>
        <div className="grid grid-cols-3 py-0.5 gap-0.5">
            <div className="col-span-2 p-2 bg-red-300">
                {top_ten_carsdata_from_ws.map(car => (
                  <div className="flex gap-0.5">
                    <div className="min-w-32 bg-slate-200 p-2 flex items-center">{car[1].id}</div>
                    <div className="min-w-32 bg-slate-200 p-2 flex items-center">{car[1].city}</div>
                    <div className="min-w-32 bg-amber-200 p-2 flex items-center ">{car[1].speed}</div>
                    <div className="min-w-48 bg-blue-400 p-2 flex items-center ">{car[1].fuel_level}</div>
                    <div className="min-w-48 bg-blue-400 p-2 flex items-center ">{car[1].latitude}</div>
                    <div className="min-w-48 bg-blue-400 p-2 flex items-center ">{car[1].longitude}</div>
                    <div className="min-w-48 bg-blue-400 p-2 flex items-center ">{car[1].status}</div>
                  </div>
                ))}
            </div>
            <div className="col-span-1 bg-slate-100">
                <Histogram bins={speed_histogram} width={600} height={400}/>
            </div>
        </div>
        <div className="grid grid-cols-3 py-0.5 gap-0.5">
            <div className="col-span-1 bg-green-300">
              <MapContainer
              center={position}
              zoom={14}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              >
                  <TileLayer
                          attribution='&copy; OpenStreetMap contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                <DensityHeatmap cells={[{lat : 50.8282, lng : 12.9209, count : 100},{lat : 50.8320, lng : 12.9233, count : 100}]}/>
              </MapContainer>
            </div>
            <div className="col-span-2 p-2 h-96 bg-amber-400">
                
            </div>
        </div>
        <div className="grid grid-cols-3 py-0.5 gap-0.5">
            <div className="col-span-2 p-2 h-96 bg-red-300">
                
            </div>
            <div className="col-span-1 bg-green-300">

            </div>
        </div>
    </div>
}