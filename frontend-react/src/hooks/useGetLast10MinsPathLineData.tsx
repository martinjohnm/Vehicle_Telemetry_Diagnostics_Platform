import { useEffect } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { pathLineTimeInterval, singleCarPathCoords } from "../store/atoms"
import { apiRequest } from "../services/api"
import { API_BASES } from "../config"
import type { CarData } from "../types/car"




export const useGetLast10MinsPathLineData = (carId : string) => {

    const setPath = useSetRecoilState(singleCarPathCoords)

    const interval = useRecoilValue(pathLineTimeInterval)
    
    useEffect(() => {


        const getPath = async () => {
                try {
        
            
                    const response = await apiRequest<{result : CarData[]}>(API_BASES.BACKEND, `/api/v1/car/car-path-by-id?carId=${carId}&interval=${interval}`);

                    const path : [number, number][] = []
                    response.result.map(pat => (path.push([pat.latitude, pat.longitude])))
                    
                    setPath(path)                
                } catch(error ) {
                    console.log("error while getting speed data by date range", error);
                    
                }
            }
        
        getPath()
    }, [carId, interval])
}