
export type SpeedBin = { range: string; count: number };


export interface AnalyticsData {
    type : string, 
    top_ten_cars : [string, CarData][]
    speed_histogram : SpeedBin[],
    car_count_by_city : { key: string; val: number; }[], 
    car_aggr_lat_lng_city : { key: string; val: [number, number]; }[]
    average_fleet_speed : number
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


export interface MapState {
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