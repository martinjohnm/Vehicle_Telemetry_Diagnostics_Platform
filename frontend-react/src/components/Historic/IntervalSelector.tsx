import { intervalsArray, type TimeIntervalType } from "../../types/historydata";
import { useSetRecoilState } from "recoil";
import { selectedIntervalState } from "../../store/atoms";

interface IntervalSelectorProps {
  value: TimeIntervalType;
  
}

export const IntervalSelector = ({value} : IntervalSelectorProps) => {

      const setInterval = useSetRecoilState(selectedIntervalState)
  
  return (
    <select
      value={value}
      onChange={(e) => setInterval(e.target.value as TimeIntervalType)}
      className="p-2 border rounded"
    >
      {intervalsArray.map((interval) => (
        <option key={interval} value={interval}>
          {interval}
        </option>
      ))}
    </select>
  );
};
