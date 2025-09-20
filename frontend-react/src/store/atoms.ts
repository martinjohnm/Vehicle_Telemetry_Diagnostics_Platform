import { atom } from "recoil";
import type { carId } from "../types/store";
import type { Timedata, TimeIntervalType } from "../types/historydata";

// Example: store selected car id
export const selectedCarState = atom<carId[] | null>({
  key: "selectedCarState", // unique key across your app
  default: [{id : ""}],           // default value
});

export const selectedCarId = atom<string>({
  key : "selectedCarId",
  default : "CAR-1"
})

export const speedDataByRange = atom<Timedata[] | null>({
  key : "speedDataByRange",
  default : null
})

export const selectedIntervalState = atom<TimeIntervalType>({
  key : "selectedIntervalState",
  default : "1m"
})