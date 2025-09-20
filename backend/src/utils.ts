import { TimeInterval } from "./types";




function getIntervalString(interval : TimeInterval): string {
    switch(interval) {
        case TimeInterval.ONE_MIN:
            return "1m";
        case TimeInterval.FIVE_MIN:
            return "5m";
        case TimeInterval.TEN_MIN:
            return "10m";
        case TimeInterval.FIFTEEN_MIN:
            return "15m";
        case TimeInterval.THIRTY_MIN:
            return "30m";
        case TimeInterval.ONE_HOUR:
            return "1h";
        default:
            throw new Error("Invalid interval");
    }
}