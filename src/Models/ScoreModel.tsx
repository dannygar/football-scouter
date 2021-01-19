export interface IScoreModel {
    id: string
    updatedOn: string
    time: number
    timeProc: number
    scores: IScore[]
    summaryCount: number
}

export interface IScore {
    account: string
    count: boolean
}
