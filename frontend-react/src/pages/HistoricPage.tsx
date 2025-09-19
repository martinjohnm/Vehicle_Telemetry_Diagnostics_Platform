import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { API_BASES } from "../config";


type Timedata = {
            bucket: string,
            id: string,
            city: string,
            avg_speed: number,
            max_speed: number,
            min_speed: number,
            samples: string,
        }
export const HistoricPage = () => {

      const [startDateTime, setStartDateTime] = useState("");
      const [endDateTime, setEndDateTime] = useState("");

      console.log(startDateTime);
        const [data, setData] = useState<Timedata[]>([]);
        // const [loading, setLoading] = useState(true);

        console.log(data);
        

     useEffect(() => {
              const fetchData = async () => {
                try {
                    const data = await apiRequest<Timedata[]>(API_BASES.CAR, "/api/v1/car/1h?id=CAR-123");

                    setData(data);
                } catch (error) {
                    console.error(error);
                }
                };

                fetchData();
        }, []);

    return <div className="p-2">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Historic analytics</p>
        </div>

        <div className="bg-red-200 h-screen mt-2 p-4">
            <div className="bg-green-300 h-[400px]">
                <div className="flex justify-center gap-1">
                    <input         
                        type="datetime-local"
                        onChange={(e) => setStartDateTime(e.target.value)}
                        value={startDateTime}
                        className="px-5 py-2 bg-blue-400"/>
                    <input         
                        type="datetime-local"
                        onChange={(e) => setEndDateTime(e.target.value)}
                        value={endDateTime}
                        className="px-5 py-2 bg-blue-400"/>
                </div>
            </div>
        </div>
        
    </div>
}