import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function DensityHeatmap({cells}: { cells :  { key: string; val: [number, number]; }[]}) {
  const map = useMap();

  useEffect(() => {
    const points = cells.map(cell => [cell.val[0], cell.val[1], 200]); // last value = intensity
 
    const heatLayer = L.heatLayer(points, { radius: 25 }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [cells, map]);

  return null;
}
