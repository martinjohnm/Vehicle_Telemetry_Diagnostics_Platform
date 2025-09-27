import { MapviewComponent } from "../components/SingleCar/MapviewComponent"
import { useSubscribeSingleCarChannel } from "../hooks/useSubscribeSingleCarChannel";
import { useGetLast10MinsPathLineData } from "../hooks/useGetLast10MinsPathLineData";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedCarId } from "../store/atoms";


export const SingleCarPage = () => {

  
    const params = useParams()
    console.log(params);

    const [carId, setCarId] = useRecoilState(selectedCarId)
    
    useEffect(() => {
      setCarId(params.id ?? "CAR-1")
    }, [params])

    useSubscribeSingleCarChannel(carId)
    useGetLast10MinsPathLineData(carId)


    return     <div className="h-screen w-screen items-center justify-center">
          <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Live View of car-id = {carId}</p>
        </div>
          <div className="w-full h-full flex items-center justify-center"> 
            <MapviewComponent/>
          </div>
        </div>
        
}