import { EventType } from "../Models/EventModel";

export const getEventType = (type: EventType) => {
    switch (type) {
        case EventType.PEP:
            return "Pass"
        case EventType.PED:
            return "Dribble"
        case EventType.POS:
            return "Possession"
        case EventType.DIS:
            return "Disruption"
        case EventType.ERR:
            return "Error"
        case EventType.RUN:
            return "Run"
        default:
            return "Unknown"                                
    }
}


export const convertToEventType = (object: any): EventType => {
    return EventType[object as keyof typeof EventType]
}