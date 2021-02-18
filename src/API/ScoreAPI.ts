import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import IConsensusModel from '../Models/ConsensusModel'
import { IGoldCircle } from '../Models/EventModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/events`

export const getGameStats = async (gameId: string, agentKeys: string[], token: string): Promise<IConsensusModel[]> => {
  try {
    const payload: IGoldCircle = {
      gameId: gameId,
      agentIds: agentKeys
    }
    const apiUrl = `${baseUrl}/game/stats?id=${gameId}`
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<IConsensusModel[]> = await axios.post(
      apiUrl,
      payload,
      config
    )

    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}
