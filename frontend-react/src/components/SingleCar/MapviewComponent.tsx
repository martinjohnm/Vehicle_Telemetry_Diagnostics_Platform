import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { SignalingManager } from "../../utils/SignalingManager";
import 'leaflet/dist/leaflet.css';
import type { IncomingMessage } from "../../types/in";



interface MapState {
  type : string;
  id   : number;
  city : string;
  speed : number;
  latitude : number;
  longitude : number;
  fuel_level : number;
  direction : number;
  status : string;
  timestamp  :string
}

export const MapviewComponent = ({car}: {car: string}) => {
const position: [number, number] = [50.8295, 12.9150];
  const [pathCoords, setPathCoords] = useState<[number, number][]>([]);

  const [mapParams , setMapParams] = useState<MapState>({
    type : "",
    id: 0,
    city : "",
    speed : 0,
    latitude : 0,
    longitude : 0,
    fuel_level : 0,
    direction : 0,
    status : "",
    timestamp  :""
  })


  console.log(car);
  
  

  useEffect(() => {
    const init = async () => {

      SignalingManager.getInstance().sendMessage({"method" : "SUBSCRIBE", "params" : [car]})

      SignalingManager.getInstance().registerCallBack("CAR", (data: IncomingMessage) => {
        setMapParams({
          type : data.type,
          id: data.id,
          city : data.city,
          speed : data.speed,
          latitude : data.latitude,
          longitude : data.longitude,
          fuel_level : data.fuel_level,
          direction : data.direction,
          status : data.status,
          timestamp  :data.timestamp
        })

        setPathCoords((prev) => [...prev, [data.latitude, data.longitude]])
      }, `CAR-${car}`)

      return () => {
        SignalingManager.getInstance().sendMessage({"method" : "UNSUBSCRIBE", "params" : [car]})
        SignalingManager.getInstance().deregisterCallBack("car", `CAR-${car}`)
      }

    }

    init()
  }, [car])


  console.log(mapParams);
  
    return (
        <div className="w-full h-full  rounded shadow">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[mapParams.latitude, mapParams.longitude]}>
          <Popup>Car location</Popup>
        </Marker>

        {pathCoords.length > 0 && (
          <Polyline positions={pathCoords} color='red' />
        )}

      </MapContainer>
      <div className='bg-red-600'>{`Latitude : ${mapParams.latitude}`}</div>
      <div className='bg-red-600'>{`Longitude : ${mapParams.longitude}`}</div>
      <div className='bg-red-600'>{`speed : ${mapParams.speed}`}</div>
      <div className='bg-red-600'>{`Direction : ${mapParams.direction}`}</div>
      <div className='bg-red-600'>{`City : ${mapParams.city}`}</div>
    </div>
    )
}