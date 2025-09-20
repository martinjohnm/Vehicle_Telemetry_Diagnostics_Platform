import { useState } from "react";
import { BucketGraph } from "../components/Historic/BucketGraph";
import CarSelector from "../components/Historic/CarSelector";
import { useRecoilValue } from "recoil";
import { selectedCarId, selectedIntervalState } from "../store/atoms";
import { useGetSpeedForSelectedDateTime } from "../hooks/useGetSpeedForSelectedDateTime";
import { IntervalSelector } from "../components/Historic/IntervalSelector";

export const HistoricPage = () => {

    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const selectedCarIdd = useRecoilValue(selectedCarId)
    const interval = useRecoilValue(selectedIntervalState)
    const {getSpeedByDateAndTime} = useGetSpeedForSelectedDateTime()

    const getData = () => {

        if (!startDateTime || !endDateTime || !selectedCarIdd) {
            alert("no date selected")
            return 
        }
        getSpeedByDateAndTime({carId : selectedCarIdd, startTime : startDateTime, endTime : endDateTime, interval: interval})
    }

    return <div className="p-2">
        <div className="w-full bg-slate-100 rounded-2xl flex items-center">
            <p className="text-4xl p-2">Historic analytics</p>
        </div>

        <div className="h-screen mt-2 p-4">
            <div className="">
                <div className="flex justify-center gap-1">
                    <div className="flex justify-center flex-col">
                        <label className="font-bold" htmlFor="">{"start-time"}</label>
                        <input         
                            type="datetime-local"
                            onChange={(e) => setStartDateTime(e.target.value)}
                            value={startDateTime}
                            className="px-5 py-2 bg-slate-200"/>
                    </div>
                    <div className="flex justify-center flex-col">
                        <label className="font-bold" htmlFor="">{"end-time"}</label>
                        <input         
                            type="datetime-local"
                            onChange={(e) => setEndDateTime(e.target.value)}
                            value={endDateTime}
                            className="px-5 py-2 bg-slate-200"/>
                    </div>
                    <div className="flex justify-center flex-col">
                        <label className="font-bold" htmlFor="">{"car-id"}</label>
                        <CarSelector/>
                    </div>

                    <div className="flex justify-center flex-col">
                        <label className="font-bold" htmlFor="">{"interval"}</label>
                        <IntervalSelector value={interval}/>
                    </div>
                    <div className="flex justify-end flex-col">
                        <button onClick={getData} className="bg-green-400 p-2 rounded-md cursor-pointer hover:bg-green-500">Get data</button>
                    </div>
                    
                </div>
                
            
                {<BucketGraph/>}
            </div>
        </div>
        
    </div>
}