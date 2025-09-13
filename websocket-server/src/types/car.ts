
export type SpeedBin = { range: string; count: number };


export interface AnalyticsData {
    type : string, 
    top_ten_cars : [string, CarData][]
    speed_histogram : SpeedBin[]
}



export interface CarData {
  type: string;
  id: string;
  city: string;
  speed: number;
  latitude: number;
  longitude: number;
  fuel_level: number;
  direction: number;
  status: string;
  timestamp: number;
}
