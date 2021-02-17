import axios, { AxiosResponse } from 'axios'
import { IResultsModel, IStandingsModel } from '../Models/ResultsModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/results`

export const getGameResults = async (gameId: string): Promise<IResultsModel[]> => {
  try {
    const apiUrl = `${baseUrl}?id=${gameId}`
    const response: AxiosResponse<IResultsModel[]> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}

export const calculateGameResults = async (gameId: string): Promise<IResultsModel[]> => {
  try {
    const apiUrl = `${baseUrl}/calculate?id=${gameId}`
    const response: AxiosResponse<IResultsModel[]> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}

export const getCurrentStandings = async (numOfGames: number): Promise<IStandingsModel[]> => {
  try {
    const apiUrl = `${baseUrl}/standings?numOfGames=${numOfGames}`
    const response: AxiosResponse<IStandingsModel[]> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}
