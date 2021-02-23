import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IResultsModel, IStandingsModel } from '../Models/ResultsModel'

const apiUrl = process.env.REACT_APP_API_URL as string
const controllerUrl: string = apiUrl.charAt(apiUrl.length - 1) === '/' ? 'api/results' : '/api/results'
const baseUrl = `${apiUrl}${controllerUrl}`

export const getGameResults = async (gameId: string, token: string): Promise<IResultsModel[]> => {
  try {
    const apiUrl = `${baseUrl}?id=${gameId}`
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<IResultsModel[]> = await axios.get(apiUrl, config)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}

export const calculateGameResults = async (gameId: string, token: string): Promise<IResultsModel[]> => {
  try {
    const apiUrl = `${baseUrl}/calculate?id=${gameId}`
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<IResultsModel[]> = await axios.get(apiUrl, config)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}

export const getCurrentStandings = async (numOfGames: number, token: string): Promise<IStandingsModel[]> => {
  try {
    const apiUrl = `${baseUrl}/standings?numOfGames=${numOfGames}`
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<IStandingsModel[]> = await axios.get(apiUrl, config)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}
