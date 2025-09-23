import { useState } from "react";
import { BucketGraph } from "../components/Historic/BucketGraph";
import CarSelector from "../components/Historic/CarSelector";
import { useRecoilValue } from "recoil";
import { selectedCarId, selectedIntervalState } from "../store/atoms";
import { useGetSpeedForSelectedDateTime } from "../hooks/useGetSpeedForSelectedDateTime";
import { IntervalSelector } from "../components/Historic/IntervalSelector";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const AnalyticsPage = () => {


    const now = new Date();
    const tenMinutesBefore = new Date(now.getTime() - 10 * 60 * 1000);

    const [startDateTime, setStartDateTime] = useState<Date>(tenMinutesBefore);
    const [endDateTime, setEndDateTime] = useState<Date>(now);
    const selectedCarIdd = useRecoilValue(selectedCarId)
    const interval = useRecoilValue(selectedIntervalState)
    const {getSpeedByDateAndTime} = useGetSpeedForSelectedDateTime()

    const getData = () => {

        if (!startDateTime || !endDateTime || !selectedCarIdd) {
            alert("no date selected")
            return 
        }
        console.log(startDateTime, endDateTime);
        
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
                        {/* <input         
                            type="datetime-local"
                            onChange={(e) => setStartDateTime(e.target.value)}
                            value={startDateTime}
                            defaultValue={startDateTime}

                            className="px-5 py-2 bg-slate-200"/> */}
                            <DatePicker
                                  selected={new Date(startDateTime)}
                                  onChange={(date: Date | null) => setStartDateTime(date ?? new Date())}
                                  showTimeSelect
                                  dateFormat="yyyy-MM-dd HH:mm"
                                  className="border rounded p-2 w-64"
                                />
                    </div>
                    <div className="flex justify-center flex-col">
                        <label className="font-bold" htmlFor="">{"end-time"}</label>
                        {/* <input         
                            type="datetime-local"
                            onChange={(e) => setEndDateTime(e.target.value)}
                            value={endDateTime}
                            defaultValue={endDateTime}
                            className="px-5 py-2 bg-slate-200"/> */}
                            <DatePicker
                                  selected={new Date(endDateTime)}
                                  onChange={(date: Date | null) => setEndDateTime(date ?? new Date())}
                                  showTimeSelect
                                  dateFormat="yyyy-MM-dd HH:mm"
                                  className="border rounded p-2 w-64"
                                />
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
                
                <div className="flex justify-center gap-1">
                    {<BucketGraph/>}
                </div>
                
            </div>
        </div>
        
    </div>
}