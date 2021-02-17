import { BaseModel } from "./BaseModel";

export interface IResultsModel extends BaseModel {
    gameId: string
    agentId: string
    displayName: string
    hits: number
    maverics: number
    score: number
}

export interface IStandingsModel extends BaseModel {
    agentId: string
    displayName: string
    score: number
}