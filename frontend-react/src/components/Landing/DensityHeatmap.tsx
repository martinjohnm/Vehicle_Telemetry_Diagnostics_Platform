import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function DensityHeatmap({ cells }: { cells: { lat: number; lng: number; count: number }[] }) {
  const map = useMap();

  useEffect(() => {
    const points = cells.map(cell => [cell.lat, cell.lng, cell.count]); // last value = intensity
    const heatLayer = L.heatLayer(points, { radius: 25 }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [cells, map]);

  return null;
}
