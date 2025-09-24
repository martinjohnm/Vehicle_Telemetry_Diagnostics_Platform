import Select from "react-select";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedCarId, selectedCarState } from "../../store/atoms";


export default function CarSelector() {


const cars = useRecoilValue(selectedCarState)
const [carId, setCarId] = useRecoilState(selectedCarId)

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
      onChange={(selected) => setSelctedCarId(selected?.value ?? carId)}
      isSearchable
      defaultValue={{
          value : carId,
          label : carId
      }}
      placeholder="Select a car..."
      className=" z-50 w-full"
    />
  );
}
