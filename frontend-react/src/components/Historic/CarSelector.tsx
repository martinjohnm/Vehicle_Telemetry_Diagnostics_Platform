import Select from "react-select";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedCarId, selectedCarState } from "../../store/atoms";


export default function CarSelector() {


const cars = useRecoilValue(selectedCarState)
const setCarId = useSetRecoilState(selectedCarId)

const carOptions = cars?.map(car => ({
    value : car.id,
    label : car.id
}))

const setSelctedCarId = (value : string) => {
    setCarId(value)
}

  return (
    <Select
      options={carOptions}
      onChange={(selected) => setSelctedCarId(selected?.value ?? "CAR-1")}
      isSearchable
      placeholder="Select a car..."
      className=" z-50"
    />
  );
}
