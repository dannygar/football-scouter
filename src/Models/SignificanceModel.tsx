export enum SignificanceType {
    Penetration = 0,
    Possession = 1,
    Disruption = 2,
    Error = 3
}

export interface ISignificance {
    id: string
    time: number
    advTeam: string
    sigType: SignificanceType
    position: number
    significance: number
    credit?: string
    blame?: string
    status: boolean
}

export interface SignificanceProps {
    significance: ISignificance
}

export type SignificanceDataType = {
    message: string
    status: string
    significances: ISignificance[]
    significance: ISignificance
}