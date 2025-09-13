type Car = { id: string; lat: number; lng: number; speed: number };
type Cell = { lat: number; lng: number; count: number };

export function getDensityGrid(cars: Car[], cellSize: number): Cell[] {
  const cellsMap = new Map<string, Cell>();

  cars.forEach(car => {
    // Compute cell key
    const cellX = Math.floor(car.lng / cellSize);
    const cellY = Math.floor(car.lat / cellSize);
    const key = `${cellX},${cellY}`;

    if (!cellsMap.has(key)) {
      cellsMap.set(key, { lat: cellY * cellSize, lng: cellX * cellSize, count: 0 });
    }

    cellsMap.get(key)!.count += 1;
  });

  return Array.from(cellsMap.values());
}
