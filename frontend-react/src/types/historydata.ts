





export const TimeInterval = {
  ONE_MIN: "1m",
  FIVE_MIN: "5m",
  TEN_MIN: "10m",
  FIFTEEN_MIN: "15m",
  THIRTY_MIN: "30m",
  ONE_HOUR: "1h",
} as const;

// Type helper
export type TimeIntervalType = typeof TimeInterval[keyof typeof TimeInterval];
export const intervalsArray: TimeIntervalType[] = Object.values(TimeInterval);

export type Timedata = {
            bucket: string,
            id: string,
            city: string,
            avg_speed: number,
            max_speed: number,
            min_speed: number,
            samples: string,
        }

