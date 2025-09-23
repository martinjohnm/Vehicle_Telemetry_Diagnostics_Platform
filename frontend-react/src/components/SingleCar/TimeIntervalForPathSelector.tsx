import { useRecoilState } from "recoil";
import { pathLineTimeInterval } from "../../store/atoms";

export default function TimeIntervalForPathSelector() {

  const [interval, setInterval] = useRecoilState(pathLineTimeInterval)
  const handleChange = (e : any) => {
    setInterval(e.target.value);
  };

  return (
    <div className="flex items-center justify-center font-bold">
      <p>showing</p>
      <select className=" border-1 outline-none rounded-md" value={interval} onChange={handleChange}>
        <option value={10}>Last 10 minutes</option>
        <option value={15}>Last 15 minutes</option>
        <option value={30}>Last 20 minutes</option>
        <option value={60}>Last 60 minutes</option>
      </select>
      <p>path</p>
    </div>
  );
}
