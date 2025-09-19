import { atom } from "recoil";
import type { carId } from "../types/store";

// Example: store selected car id
export const selectedCarState = atom<carId[] | null>({
  key: "selectedCarState", // unique key across your app
  default: [{id : ""}],           // default value
});

export const selectedCarId = atom<string>({
  key : "selectedCarId",
  default : "CAR-1"
})