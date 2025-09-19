import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Timedata } from "../../types/historydata";



export const BucketGraph = ({data} : {data : Timedata[]}) => {


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
