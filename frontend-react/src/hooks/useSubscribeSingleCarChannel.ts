import { useEffect } from "react"
import { SignalingManager } from "../utils/SignalingManager"
import type { IncomingMessage } from "../types/in"
import { useSetRecoilState } from "recoil"
import { singleCarMapState, singleCarPathCoords } from "../store/atoms"



export const useSubscribeSingleCarChannel = (car: string) => {

    const setPath = useSetRecoilState(singleCarPathCoords)
    const setMap = useSetRecoilState(singleCarMapState)

    useEffect(() => {
        SignalingManager.getInstance().sendMessage({"method" : "SUBSCRIBE", "params" : [car]})

        SignalingManager.getInstance().registerCallBack("CAR", (data: IncomingMessage) => {
            setMap({
            type : data.type,
            id: data.id,
            city : data.city,
            speed : data.speed,
            latitude : data.latitude,
            longitude : data.longitude,
            fuel_level : data.fuel_level,
            direction : data.direction,
            status : data.status,
            timestamp  :data.timestamp
            })

            setPath((prev) => [...prev, [data.latitude, data.longitude]])

            
        }, `CAR-${car}`)

        return () => {
            console.log("deregisted");
        
            SignalingManager.getInstance().sendMessage({"method" : "UNSUBSCRIBE", "params" : [car]})
            SignalingManager.getInstance().deregisterCallBack("CAR", `CAR-${car}`)
            setMap(null)
            setPath([])
        }
        
    }, [])
}