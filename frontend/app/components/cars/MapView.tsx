
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

type MapProps = {
  lat: number;
  lng: number;
};

export default function MapView({ lat, lng }: MapProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-300 w-[400px] h-[250px]">
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Car is here</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
