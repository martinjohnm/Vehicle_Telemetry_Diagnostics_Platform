import { atom } from "recoil";
import type { carId } from "../types/store";
import type { Timedata, TimeIntervalType } from "../types/historydata";
import type { CarData, MapState, SpeedBin, TimeIntervalToQueryPath } from "../types/car";

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


// single car path state
export const singleCarMapState = atom<MapState | null>({
  key : "singleCarMapState",
  default : null
})

export const singleCarPathCoords = atom<[number, number][]>({
  key : "singleCarPathCoords",
  default : []
})
export const pathLineTimeInterval = atom<TimeIntervalToQueryPath>({
  key : "pathLineTimeInterval",
  default : 10
})



// single car analytics states
export const topTenCarState = atom<[string, CarData][]>({
  key : "topTenCarState",
  default : []
})
export const speedHistogramState = atom<SpeedBin[]>({
  key : "speedHistogramState",
  default : []
})
export const latLngByCityState = atom<{ key: string; val: [number, number]; }[]>({
  key : "latLngByCityState",
  default : []
})
export const avgSpeedFromwsState = atom<number>({
  key : "",
  default : 0
})