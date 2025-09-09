import { useEffect, useState } from "react"
import { SignalingManager } from "../utils/SignalingManager"
import type { IncomingMessage } from "../types/in"
import type { AnalyticsTypes } from "../types/out"


export const LandingPage = () => {



    const [analytics, setAnalytics] = useState<AnalyticsTypes[]>(["top_ten_car_by_speed"])



      useEffect(() => {


        setAnalytics(["top_ten_car_by_speed"])


        const init = async () => {
    
          SignalingManager.getInstance().sendMessage({"method" : "SUBSCRIBE_ANALYTICS", "params" : analytics})
    
          SignalingManager.getInstance().registerCallBack("ANALYTICS", (data: IncomingMessage) => {
          
            console.log(data);
            
            
          }, `ANALYTICS-TOP_TEN_CARS`)
    
          return () => {
            SignalingManager.getInstance().sendMessage({"method" : "UNSUBSCRIBE_ANALYTICS", "params" : analytics})
            SignalingManager.getInstance().deregisterCallBack("ANALYTICS", `ANALYTICS-TOP_TEN_CARS`)
          }
    
        }
    
        init()
      }, [analytics])
    
    
    return <div className="p-2">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Telematics dashboard</p>
        </div>
        <div className="grid grid-cols-3 py-0.5 gap-0.5">
            <div className="col-span-2 p-2 h-96 bg-red-300">
                
            </div>
            <div className="col-span-1 bg-green-300">

            </div>
        </div>
        <div className="grid grid-cols-3 py-0.5 gap-0.5">
            <div className="col-span-1 bg-green-300">

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