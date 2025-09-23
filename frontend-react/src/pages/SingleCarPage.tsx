import { useParams } from "react-router-dom"
import { MapviewComponent } from "../components/SingleCar/MapviewComponent"
import { useEffect } from "react";


export const SingleCarPage = () => {


    const params = useParams()

    useEffect(() => {

    }, [params])
    

    return     <div className="h-screen w-screen items-center justify-center">
          <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Live View of car-id = {params.id}</p>
        </div>
          <div className="w-full h-full flex items-center justify-center"> 
            <MapviewComponent carId={`${params.id}`}/>
          </div>
        </div>
        
}