import { Link } from "react-router-dom";
import type { CarData } from "../../types/car";





export const  TopTenCarLeaderBoard = ({cars}: {cars : [string, CarData][]}) => {

  return (

    <div className="flex overflow-x-auto">
      {cars.map(car => (
        <div key={car[1].id} style={{ minWidth: '120px', border: '1px solid #ccc', padding: '5px', textAlign: 'center' }}>
          <strong>{car[1].id}</strong>
          <p>{car[1].speed} km/h</p>
          <div style={{ height: '5px', background: '#8884d8', width: `${car[1].speed}%` }} />
          <Link className="bg-green-500 p-1 rounded-md text-sm" to={`/car/${car[1].id}`}>View</Link>
        </div>
        
      ))}
    </div>

  );
}
