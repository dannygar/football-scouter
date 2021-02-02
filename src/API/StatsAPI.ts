import { v4 as uuid } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import IGoldCircleModel from '../Models/GoldCircleModel'
import { IEvent, IEventModel } from '../Models/EventModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/stats`

export const getGoldCircle = async (gameId: string): Promise<IGoldCircleModel | null> => {
  try {
    const apiUrl = `${baseUrl}/goldcircle?id=${gameId}`
    const response: AxiosResponse<IGoldCircleModel> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : null
  } catch (error) {
    return null
  }
}

export const saveGoldCircle = async (goldCircle: IGoldCircleModel): Promise<string> => {
  try {
    const apiUrl = `${baseUrl}/goldcircle/save`
    const response: AxiosResponse<boolean> = await axios.post(
      apiUrl,
      goldCircle
    )
    return response ? 'Saved' : 'Failed'
  } catch (error) {
    return error
  }
}


export const saveConsensus = async (
  events: IEvent[], account: string, email: string, gameId: string
): Promise<string> => {
  try {
    const apiUrl = `${baseUrl}/consensus/save`
    const scores: IEventModel = {
      id: uuid(),
      account: account,
      email: email,
      gameId: gameId,
      updatedOn: '',
      events: events
    }
    const response: AxiosResponse<boolean> = await axios.post(
      apiUrl,
      scores
    )
    return response ? 'Saved' : 'Failed'
  } catch (error) {
    return error
  }  
}

