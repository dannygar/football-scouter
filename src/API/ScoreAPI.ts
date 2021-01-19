import axios, { AxiosResponse } from 'axios'
import { IScoreModel } from '../Models/ScoreModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/events`

export const getGameStats = async (gameId: string): Promise<IScoreModel[]> => {
  try {
    const apiUrl = `${baseUrl}/game/stats?id=${gameId}`
    const response: AxiosResponse<IScoreModel[]> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}

