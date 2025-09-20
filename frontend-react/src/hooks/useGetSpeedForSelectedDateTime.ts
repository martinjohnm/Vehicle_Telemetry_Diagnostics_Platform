import { useSetRecoilState } from "recoil";
import { API_BASES } from "../config";
import { apiRequest } from "../services/api";
import type { Timedata } from "../types/historydata";
import { speedDataByRange } from "../store/atoms";



export const useGetSpeedForSelectedDateTime = () => {


    const setSpeedData = useSetRecoilState(speedDataByRange)

    const getSpeedByDateAndTime = async ({carId, startTime, endTime, interval} : {carId : string, startTime : string, endTime : string, interval : string}) => {
        try {

            const start = new Date(startTime).toISOString();
            const end = new Date(endTime).toISOString();

       
            const params = new URLSearchParams({
                carId,
                start,
                end,
                interval
            });
            
            const response = await apiRequest<{result : Timedata[]}>(API_BASES.CAR, `/api/v1/car/speed-data-by-interval?${params.toString()}`);
            console.log(response.result);
            
            setSpeedData([...response.result])
            
        } catch(error ) {
            console.log("error while getting speed data by date range", error);
            
        }
    }

    return {getSpeedByDateAndTime}


}