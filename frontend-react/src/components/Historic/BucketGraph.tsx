import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useRecoilValue } from "recoil";
import { speedDataByRange } from "../../store/atoms";



export const BucketGraph = () => {

  const data = useRecoilValue(speedDataByRange)
  // console.log(data);
  
  if (data === null) return <p>Loading...</p>;


  return (
    <LineChart width={1200} height={600} data={data}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="bucket" tickFormatter={(value) =>
          new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }/>
      <YAxis  />
      <Tooltip />
      <Line type="monotone" dataKey="avg_speed" stroke="#8884d8" />
    </LineChart>
  );
}
