import { useEffect, useState } from "react"
import { SignalingManager } from "../utils/SignalingManager"
import Histogram from "../components/Landing/Histogram";
import { DensityHeatmap } from "../components/Landing/DensityHeatmap";
import { MapContainer, TileLayer } from "react-leaflet";
import type { AnalyticsData, CarData } from "../types/car";
import { TopTenCarLeaderBoard } from "../components/Landing/ToptenCarLeaderBoard";
import { FleetSpeedChart } from "../components/Landing/Flatspeedchart";
// import type { AnalyticsTypes } from "../types/out"





type SpeedBin = { range: string; count: number };


export const LandingPage = () => {



    // const [analytics, setAnalytics] = useState<AnalyticsTypes[]>(["top_ten_car_by_speed"])
    const position: [number, number] = [50.8295, 12.9150];

    const [top_ten_carsdata_from_ws, setTopTenCarsData] = useState<[string, CarData][]>([])
    const [speed_histogram, setSpeedHistogram] = useState<SpeedBin[]>([])
    const [aggr_lat_lng_by_city, setAggLatLngByCity] = useState<{ key: string; val: [number, number]; }[]>([])
    const [avg_fleet_speed, setAverageSpeed] = useState<number>(0)

    console.log(avg_fleet_speed);

      useEffect(() => {
        const init = async () => {
    
          SignalingManager.getInstance().sendMessage({"method" : "SUBSCRIBE_ANALYTICS", "params" : ["top_ten_car_by_speed"]})
    
          SignalingManager.getInstance().registerCallBack("ANALYTICS", (data: AnalyticsData) => {
          
            setTopTenCarsData(data.top_ten_cars as [string, CarData][])
            setSpeedHistogram(data.speed_histogram as SpeedBin[])
            setAggLatLngByCity(data.car_aggr_lat_lng_city)
            setAverageSpeed(data.average_fleet_speed)
        
          }, `ANALYTICS-TOP_TEN_CARS`)
    
          return () => {
            SignalingManager.getInstance().sendMessage({"method" : "UNSUBSCRIBE_ANALYTICS", "params" : ["top_ten_car_by_speed"]})
            SignalingManager.getInstance().deregisterCallBack("ANALYTICS", `ANALYTICS-TOP_TEN_CARS`)
          }
    
        }
    
        init()
      }, [top_ten_carsdata_from_ws])

    
    return <div className="p-2">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Telematics dashboard</p>
        </div>
        <div className="grid grid-cols-3 py-0.5 gap-0.5">
                <div className="col-span-1 p-2">
                <FleetSpeedChart avgSpeed={avg_fleet_speed} maxSpeed={top_ten_carsdata_from_ws[0][1].speed}/>
            </div>
            
            <div className="col-span-1 p-2">
                <TopTenCarLeaderBoard cars={top_ten_carsdata_from_ws}/>
            </div>
            
            <div className="col-span-1">
                <Histogram bins={speed_histogram} width={600} height={400}/>
            </div>
        </div>
        <div className="py-0.5 gap-0.5">
            <div className="col-span-2 p-2 h-screen bg-amber-400">
                <MapContainer
              center={position}
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              >
                  <TileLayer
                          attribution='&copy; OpenStreetMap contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                <DensityHeatmap cells={aggr_lat_lng_by_city}/>
              </MapContainer>
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