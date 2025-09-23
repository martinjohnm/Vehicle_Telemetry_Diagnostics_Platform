import { useSetRecoilState } from "recoil"
import { avgSpeedFromwsState, latLngByCityState, speedHistogramState, topTenCarState } from "../store/atoms"
import { useEffect } from "react"
import { SignalingManager } from "../utils/SignalingManager"
import type { AnalyticsData, CarData, SpeedBin } from "../types/car"


export const useGetAnalytics = () => {

    const setTopTenCars = useSetRecoilState(topTenCarState)
    const setSpeedHistogram = useSetRecoilState(speedHistogramState)
    const setLatLngByCIty = useSetRecoilState(latLngByCityState)
    const setAvgFleetSpeed = useSetRecoilState(avgSpeedFromwsState)
    useEffect(() => {
            SignalingManager.getInstance().sendMessage({"method" : "SUBSCRIBE_ANALYTICS", "params" : ["top_ten_car_by_speed"]})
                
            SignalingManager.getInstance().registerCallBack("ANALYTICS", (data: AnalyticsData) => {
            
            setTopTenCars(data.top_ten_cars as [string, CarData][])
            setSpeedHistogram(data.speed_histogram as SpeedBin[])
            setLatLngByCIty(data.car_aggr_lat_lng_city)
            setAvgFleetSpeed(data.average_fleet_speed)
        
            }, `ANALYTICS-TOP_TEN_CARS`)
    
    
            return () => {
                SignalingManager.getInstance().sendMessage({"method" : "UNSUBSCRIBE_ANALYTICS", "params" : ["top_ten_car_by_speed"]})
                SignalingManager.getInstance().deregisterCallBack("ANALYTICS", `ANALYTICS-TOP_TEN_CARS`)
                setTopTenCars([])
                setSpeedHistogram([])
                setLatLngByCIty([])
                setAvgFleetSpeed(0)
            }
            
        }, [])
}