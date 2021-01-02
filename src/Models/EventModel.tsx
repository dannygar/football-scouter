import { IColumn } from '@fluentui/react'

export enum EventType {
    PEP = 1,
    PED = 2,
    POS = 3,
    ERR = 4,
    DIS = 5,
    RUN = 6
}

export const getEventTypes: any = () => {
    return [
        {
            label: "Pass",
            value: EventType.PEP
        },
        {
            label: "Dribble",
            value: EventType.PED
        },
        {
            label: "Possession",
            value: EventType.POS
        },
        {
            label: "Disruption",
            value: EventType.DIS
        },
        {
            label: "Error",
            value: EventType.ERR
        },
        {
            label: "Run",
            value: EventType.RUN
        },
    ]
}

export interface ScoreModel {
    id: string
    updatedOn: string
    user: string
    gameId: string
    events: IEvent[]
}

export interface IEvent {
    id: string
    time: string
    advTeam: string
    eventType: number
    position: number
    significance: number
    credit?: string
    blame?: string
    comments?: string
}

export interface EventProps {
    event: IEvent
}

export type EventDataType = {
    message: string
    status: string
    events: IEvent[]
    event: IEvent
}

export interface IEventDetailsListState {
    columns: IColumn[];
    items: IEvent[];
}