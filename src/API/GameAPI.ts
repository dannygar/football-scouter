import { v4 as uuid } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import { IGame } from '../Models/GameModel'

const baseUrl: string = 'http://localhost:4000'

export const getGames = async (): Promise<AxiosResponse<IGame[]>> => {
  try {
    const games: AxiosResponse<IGame[]> = {
      data: 
        [
          {
            id: uuid(),
            homeTeam: "Atletico Madrid",
            awayTeam: "Chelsea",
            playedOn: "02/23/2021",
            fullGame: false,
            league: "Champions League"
          },
          {
            id: uuid(),
            homeTeam: "Real Madrid",
            awayTeam: "PSG",
            playedOn: "02/23/2021",
            fullGame: false,
            league: "Champions League"
          },
        ],
      status: 200,
      statusText: "OK",
      headers: "application/json",
      config: {}
    }
    // const events: AxiosResponse<IGame[]> = await axios.get(
    //   baseUrl + '/games'
    // )
    return games
  } catch (error) {
    throw new Error(error)
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


export const saveGames = async (games: IGame[]): Promise<IGame[]> => {
    try {
    // const event: Omit<IEvent, 'id'> = {
    //     time: formData.time,
    //     advTeam: formData.advTeam,
    //     eventType: formData.eventType,
    //     position: formData.position,
    //     significance: formData.significance,
    //     status: false,
    // }
    // const saveEvent: AxiosResponse<EventDataType> = await axios.post(
    //   baseUrl + '/add-event',
    //   event
    // )
    return games
  } catch (error) {
    throw new Error(error)
  }
}

