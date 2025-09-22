import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useRecoilValue } from "recoil";
import { singleCarMapState, singleCarPathCoords } from "../../store/atoms";
import { useSubscribeSingleCarChannel } from "../../hooks/useSubscribeSingleCarChannel";



export const MapviewComponent = ({car}: {car: string}) => {

  // const [carid, setCarId] = useRecoilState(selectedCarId)

  // setCarId(car)
  const position: [number, number] = [50.8295, 12.9150];
  // const [pathCoords, setPathCoords] = useState<[number, number][]>([]);

  // const [map? , setmap?] = useState<MapState>({
  //   type : "",
  //   id: 0,
  //   city : "",
  //   speed : 0,
  //   latitude : 0,
  //   longitude : 0,
  //   fuel_level : 0,
  //   direction : 0,
  //   status : "",
  //   timestamp  :""
  // })



  const path = useRecoilValue(singleCarPathCoords)
  const map = useRecoilValue(singleCarMapState)

  useSubscribeSingleCarChannel(car)


  
  // useEffect(() => {
  //   const init = async () => {

  //     SignalingManager.getInstance().sendMessage({"method" : "SUBSCRIBE", "params" : [car]})

  //     SignalingManager.getInstance().registerCallBack("CAR", (data: IncomingMessage) => {
  //       setmap?({
  //         type : data.type,
  //         id: data.id,
  //         city : data.city,
  //         speed : data.speed,
  //         latitude : data.latitude,
  //         longitude : data.longitude,
  //         fuel_level : data.fuel_level,
  //         direction : data.direction,
  //         status : data.status,
  //         timestamp  :data.timestamp
  //       })

  //       setPathCoords((prev) => [...prev, [data.latitude, data.longitude]])

        
  //     }, `CAR-${car}`)

  //     return () => {
  //       console.log("deregisted");
        
  //       SignalingManager.getInstance().sendMessage({"method" : "UNSUBSCRIBE", "params" : [car]})
  //       SignalingManager.getInstance().deregisterCallBack("CAR", `CAR-${car}`)
  //     }

  //   }

  //   init()


    
  // }, [carid, car])



    return (
        <div className="w-full h-full  rounded shadow">
          <div className="p-2 justify-center items-center flex">
            <div className='font-bold'>{`Driving at ${map?.speed} km/h in ${map?.city}`}</div>
          </div>
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