import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } from "recharts";
import { useRecoilValue } from "recoil";
import { speedDataByRange } from "../../store/atoms";



export const BucketGraph = () => {

  const data = useRecoilValue(speedDataByRange)
  // console.log(data);
  
  if (data === null) return <p>Loading...</p>;


  return (
    <div>
      <h1 className="flex items-center justify-center p-8 font-bold underline">{"Average speed VS Time graph"}</h1>
      <LineChart width={1200} height={600} data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="bucket" tickFormatter={(value) =>
            new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }>
            <Label value="Time" offset={-5} position="insideBottom" />
          </XAxis>
        <YAxis>
          <Label 
            value="Average Speed (km/h)" 
            angle={-90} 
            position="insideLeft" 
            style={{ textAnchor: 'middle' }}
            className="font-bold"
          />
        </YAxis>
        <Tooltip />
        <Line type="monotone" dataKey="avg_speed" stroke="#8884d8" className="font-bold"/>
      </LineChart>
    </div>
  );
}
