
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

export interface PathState {
  latitude : number;
  longitude : number;
}


export const TimeIntervalPath = {
  
  TEN_MIN: 10,
  FIFTEEN_MIN: 15,
  THIRTY_MIN: 30,
  ONE_HOUR: 60,
} as const;

export type TimeIntervalToQueryPath = typeof TimeIntervalPath[keyof typeof TimeIntervalPath]