import { IColumn } from '@fluentui/react'

export enum EventType {
    Penetration = 0,
    Possession = 1,
    Disruption = 2,
    Error = 3
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
    status: boolean
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