import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { API_BASES } from "../config";
import { BucketGraph } from "../components/Historic/BucketGraph";
import type { Timedata } from "../types/historydata";
import CarSelector from "../components/Historic/CarSelector";
import { useRecoilValue } from "recoil";
import { selectedCarId } from "../store/atoms";

export const HistoricPage = () => {

      const [startDateTime, setStartDateTime] = useState("");
      const [endDateTime, setEndDateTime] = useState("");
      const selectedCarIdd = useRecoilValue(selectedCarId)

      console.log(startDateTime);
        const [data, setData] = useState<Timedata[]>([]);
        // const [loading, setLoading] = useState(true);


     useEffect(() => {
              const fetchData = async () => {
                try {

                    const response = await apiRequest<{result : Timedata[]}>(API_BASES.CAR, `/api/v1/car/1m?id=${selectedCarIdd}`);
                    
                    setData(response.result);
                } catch (error) {
                    console.error(error);
                }
                };

                fetchData();
        }, [selectedCarIdd]);


    return <div className="p-2">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Historic analytics</p>
        </div>

        <div className="h-screen mt-2 p-4">
            <div className="">
                <div className="flex justify-center gap-1">
                    <input         
                        type="datetime-local"
                        onChange={(e) => setStartDateTime(e.target.value)}
                        value={startDateTime}
                        className="px-5 py-2 bg-slate-200"/>
                    <input         
                        type="datetime-local"
                        onChange={(e) => setEndDateTime(e.target.value)}
                        value={endDateTime}
                        className="px-5 py-2 bg-slate-200"/>
                    <CarSelector/>
                </div>
                
                <BucketGraph data={data}/>
            </div>
        </div>
        
    </div>
}