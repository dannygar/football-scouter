import axios, { AxiosResponse } from 'axios'
import IConsensusModel from '../Models/ConsensusModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/events`

export const getGameStats = async (gameId: string): Promise<IConsensusModel[]> => {
  try {
    const apiUrl = `${baseUrl}/game/stats?id=${gameId}`
    const response: AxiosResponse<IConsensusModel[]> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}

