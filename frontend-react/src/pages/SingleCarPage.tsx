import { useParams } from "react-router-dom"
import { MapviewComponent } from "../components/SingleCar/MapviewComponent"


export const SingleCarPage = () => {


    const params = useParams()

    console.log(params);
    

    return     <div className="h-screen w-screen flex items-center justify-center">
          <div className="w-2/3 h-2/3 flex items-center justify-center bg-red-300"> 
            <MapviewComponent car={`CAR-${params.id}`}/>
          </div>
        </div>
        
}