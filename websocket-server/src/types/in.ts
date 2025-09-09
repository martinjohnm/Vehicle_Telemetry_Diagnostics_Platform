



export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";
export const SUBSCRIBE_ANALYTICS = "SUBSCRIBE_ANALYTICS";
export const UNSUBSCRIBE_ANALYTICS = "UNSUBSCRIBE_ANALYTICS"



export type SubscribeMessage = {
    method: typeof SUBSCRIBE,
    params: string[]
}

export type UnsubscribeMessage = {
    method: typeof UNSUBSCRIBE,
    params: string[]
}

export type SubscribeAnalytics = {
    method: typeof SUBSCRIBE_ANALYTICS,
    params: string[]
}


export type UnSubscribeAnalytics = {
    method: typeof UNSUBSCRIBE_ANALYTICS,
    params: string[]
}

export type IncomingMessage = SubscribeMessage | UnsubscribeMessage | SubscribeAnalytics | UnSubscribeAnalytics;

export type AnalyticsTypes = "top_ten_car_by_speed" | "" | "hello"