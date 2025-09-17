import { Link } from "react-router-dom";
import type { CarData } from "../../types/car";





export const  TopTenCarLeaderBoard = ({cars}: {cars : [string, CarData][]}) => {
  

    const maxValue = Math.max(...cars.map((c) => c[1].speed))
   
        const barWidth = (val: number) => {
            const base = 60; // minimum visible width %
            return base + (val / maxValue) * (100 - base);
        };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">🚗 Top 10 Cars</h2>
      <ul className="space-y-3">
        {cars.map((car, idx) => (
          <li
            key={car[1].id}
            className="bg-white shadow-md rounded-xl p-3 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-600">
                  {idx + 1}
                </span>
                <span className="font-medium">{car[1].id}</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {car[1].speed}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${barWidth(car[1].speed)}%`,
                }}
              />
            </div>
            <div className="w-full justify-center flex">
              <Link to={`/car/${car[1].id}`}>
              <button className="bg-green-500 px-2 rounded-md cursor-pointer">Track</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
