import axios, { AxiosResponse } from 'axios'
import IConsensusModel from '../Models/ConsensusModel'
import { IGoldCircle } from '../Models/EventModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/events`

export const getGameStats = async (gameId: string, agentKeys: string[]): Promise<IConsensusModel[]> => {
  try {
    const payload: IGoldCircle = {
      gameId: gameId,
      agentIds: agentKeys
    }
    const apiUrl = `${baseUrl}/game/stats?id=${gameId}`
    const response: AxiosResponse<IConsensusModel[]> = await axios.post(
      apiUrl,
      payload
    )

    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}
