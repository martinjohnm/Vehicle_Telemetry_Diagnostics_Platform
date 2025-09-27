import Histogram from "../components/Landing/Histogram";
import { DensityHeatmap } from "../components/Landing/DensityHeatmap";
import { MapContainer, TileLayer } from "react-leaflet";
import { TopTenCarLeaderBoard } from "../components/Landing/ToptenCarLeaderBoard";
import { FleetSpeedChart } from "../components/Landing/Flatspeedchart";
import { Link } from "react-router-dom";
import CarSelector from "../components/Historic/CarSelector";
import { useRecoilValue } from "recoil";
import { avgSpeedFromwsState, latLngByCityState, selectedCarId, speedHistogramState, topTenCarState } from "../store/atoms";
import { useGetLiveData } from "../hooks/useGetLiveData";



export const LandingPage = () => {

    useGetLiveData()
    const position: [number, number] = [50.1109, 8.6821];
    const top_ten_carsdata_from_ws = useRecoilValue(topTenCarState)
    const speed_histogram = useRecoilValue(speedHistogramState)
    const aggr_lat_lng_by_city = useRecoilValue(latLngByCityState)
    const avg_fleet_speed = useRecoilValue(avgSpeedFromwsState)
    const selectedCarIdd = useRecoilValue(selectedCarId)
    
    return <div className="p-2 h-screen">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center justify-between p-6">
            <p className="text-4xl p-2 w-full">Telematics dashboard</p>
            <div className="grid grid-cols-3 w-full bg-green-200">
              <Link to={"/analytics"}><button className="p-2 bg-green-400 w-full rounded-md text-medium font-bold hover:bg-green-500 cursor-pointer">See analytics</button></Link>
              
              <div className="w-full">
                <CarSelector/>
              </div>
              <Link className="w-full" to={`/car/${selectedCarIdd}`}>
              
                <button className="p-2 bg-green-400 rounded-md w-full text-medium font-bold hover:bg-green-500 cursor-pointer">View By carId</button>
              </Link>
            </div>
        </div>
        <div className="p-2 flex justify-center items-center" >
            { top_ten_carsdata_from_ws.length !=0 && <FleetSpeedChart avgSpeed={avg_fleet_speed} maxSpeed={top_ten_carsdata_from_ws[0][1].speed}/>}
            <TopTenCarLeaderBoard cars={top_ten_carsdata_from_ws}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 py-0.5 gap-0.5 h-full">
            
            
            <div className="col-span-1 md:col-span-2">
              
                <MapContainer
                  center={position}
                  zoom={5}
                  scrollWheelZoom={true}
                  style={{ height: '60vh', width: '100%' }}
                  >
                      <TileLayer
                              attribution='&copy; OpenStreetMap contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                  <DensityHeatmap cells={aggr_lat_lng_by_city}/>
                </MapContainer>
            </div>
            
            <div className="col-span-1 md:col-span-1">
                <div className="p-4"><p>{"No of cars in speed range"}</p></div>
                <Histogram bins={speed_histogram} width={600} height={400}/>
            </div>
        </div>
        
    </div>
}