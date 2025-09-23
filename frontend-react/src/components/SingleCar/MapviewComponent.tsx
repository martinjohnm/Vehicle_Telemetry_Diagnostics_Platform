import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useRecoilValue } from "recoil";
import { singleCarMapState, singleCarPathCoords } from "../../store/atoms";
import { useSubscribeSingleCarChannel } from "../../hooks/useSubscribeSingleCarChannel";
import { useGetLast10MinsPathLineData } from "../../hooks/useGetLast10MinsPathLineData";
import TimeIntervalForPathSelector from "./TimeIntervalForPathSelector";



export const MapviewComponent = ({carId}: {carId: string}) => {
  
  const position: [number, number] = [50.8295, 12.9150];
  const path = useRecoilValue(singleCarPathCoords)
  const map = useRecoilValue(singleCarMapState)


  useSubscribeSingleCarChannel(carId)
  useGetLast10MinsPathLineData(carId)

    return (
        <div className="w-full h-full  rounded shadow">
          <div className="p-2 justify-between items-center flex max-w-3xl container mx-auto">
            <div className='font-bold'>{`Driving at ${map?.speed} km/h in ${map?.city}`}</div>
            <TimeIntervalForPathSelector/>
            
          </div>
      <MapContainer
        center={[map?.latitude ?? position[0],map?.longitude ?? position[1]]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[map?.latitude ?? position[0],map?.longitude ?? position[1]]}>
          <Popup><div className=''><span>{`Lat : `}</span>{`${map?.latitude}`}</div>
            <div className=''><span>{`Lng : `}</span>{`${map?.longitude}`}</div>
            <div className=''><span>{`speed : `}</span>{`${map?.speed}`}</div>
            <div className=''><span>{`Direction : `}</span>{`${map?.direction}`}</div>
            <div className=''><span>{`City : `}</span>{`${map?.city}`}</div></Popup>
        </Marker>

        {path.length > 0 && (
          <Polyline positions={path} color='red' />
        )}

      </MapContainer>
      
    </div>
    )
}