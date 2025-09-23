import Histogram from "../components/Landing/Histogram";
import { DensityHeatmap } from "../components/Landing/DensityHeatmap";
import { MapContainer, TileLayer } from "react-leaflet";
import { TopTenCarLeaderBoard } from "../components/Landing/ToptenCarLeaderBoard";
import { FleetSpeedChart } from "../components/Landing/Flatspeedchart";
import { Link } from "react-router-dom";
import CarSelector from "../components/Historic/CarSelector";
import { useRecoilValue } from "recoil";
import { avgSpeedFromwsState, latLngByCityState, selectedCarId, speedHistogramState, topTenCarState } from "../store/atoms";
import { useGetAnalytics } from "../hooks/useGetAnalytics";



export const LandingPage = () => {

    useGetAnalytics()
 
    const position: [number, number] = [50.1109, 8.6821];
    const top_ten_carsdata_from_ws = useRecoilValue(topTenCarState)
    const speed_histogram = useRecoilValue(speedHistogramState)
    const aggr_lat_lng_by_city = useRecoilValue(latLngByCityState)
    const avg_fleet_speed = useRecoilValue(avgSpeedFromwsState)
    const selectedCarIdd = useRecoilValue(selectedCarId)
    
    return <div className="p-2 h-screen">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center justify-between p-6">
            <p className="text-4xl p-2 w-full">Telematics dashboard</p>
            <div className="flex justify-center w-full">
              <Link to={"/analytics"}><button className="p-2 bg-green-400 rounded-md text-medium font-bold hover:bg-green-500 cursor-pointer">See analytics</button></Link>
              
                  <CarSelector/>
            
              <Link className="" to={`/car/${selectedCarIdd}`}>
              
                <button className="p-2 bg-green-400 rounded-md text-medium font-bold hover:bg-green-500 cursor-pointer">View By carId</button>
              </Link>
            </div>
        </div>
        <div className="p-2 flex justify-center items-center" >
            { top_ten_carsdata_from_ws.length !=0 && <FleetSpeedChart avgSpeed={avg_fleet_speed} maxSpeed={top_ten_carsdata_from_ws[0][1].speed}/>}
            <TopTenCarLeaderBoard cars={top_ten_carsdata_from_ws}/>
        </div>
        <div className="grid grid-cols-6 py-0.5 gap-0.5">
            
            
            <div className="col-span-4 h-full">
              <div className="col-span-2 p-2 h-full">
                <MapContainer
                  center={position}
                  zoom={5}
                  scrollWheelZoom={true}
                  style={{ width: '100%', height : "100%" }}
                  >
                      <TileLayer
                              attribution='&copy; OpenStreetMap contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                  <DensityHeatmap cells={aggr_lat_lng_by_city}/>
                </MapContainer>
              </div>
            </div>
            
            <div className="col-span-2">
                <div className="p-4"><p>{"No of cars in speed range"}</p></div>
                <Histogram bins={speed_histogram} width={600} height={400}/>
            </div>
        </div>
        
    </div>
}