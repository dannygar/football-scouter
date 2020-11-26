import { EventType } from "../Models/EventModel";

export const getEventType = (type: EventType) => {
    switch (type) {
        case EventType.Penetration:
            return "Penetration"
        case EventType.Possession:
            return "Possession"
        case EventType.Disruption:
            return "Disruption"
        case EventType.Error:
            return "Error"
        default:
            return "Unknown"                                
    }
}


export const convertToEventType = (object: any): EventType => {
    return EventType[object as keyof typeof EventType]
}