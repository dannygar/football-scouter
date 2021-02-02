import { BaseModel } from "./BaseModel";

export default interface IGoldCircleModel extends BaseModel {
    gameId: string,
    agentIds: string[]
}