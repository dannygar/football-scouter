import { v4 as uuid } from 'uuid'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IGame } from '../Models/GameModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/games`

export const getGames = async (token: string): Promise<IGame[]> => {
  try {
    const apiUrl = baseUrl
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<IGame[]> = await axios.get(apiUrl, config)
    return (response.status === 200)? response.data : []
  } catch (error) {
    return []
  }
}

export const addGame = async (formData: IGame, games: IGame[]): Promise<AxiosResponse<IGame[]>> => {
    try {
    const game: IGame = {...formData, id: uuid() }
    games.push(game)

    const syncGames: AxiosResponse<IGame[]> = {
      data: games,
      status: 200,
      statusText: "OK",
      headers: "application/json",
      config: {}
    }

    return syncGames
  } catch (error) {
    throw new Error(error)
  }
}


export const saveGames = async (games: IGame[]): Promise<string> => {
  try {
    const apiUrl = `${baseUrl}/save`
    const response: AxiosResponse<boolean> = await axios.post(
      apiUrl,
      games
    )
    return response ? 'Saved' : 'Failed'
  } catch (error) {
    return error
  }
}

