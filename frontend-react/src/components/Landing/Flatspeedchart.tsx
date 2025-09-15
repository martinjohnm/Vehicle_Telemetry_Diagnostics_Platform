export const  FleetSpeedChart = ({avgSpeed, maxSpeed} : {avgSpeed : number, maxSpeed : number}) =>  {

  const percentage = (avgSpeed / maxSpeed) * 100;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Average Fleet Speed</h2>
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div
          className="bg-blue-500 h-6 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-gray-700">{avgSpeed} km/h</p>
    </div>
  );
}
