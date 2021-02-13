import { v4 as uuid } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import { IEventModel, IEvent, EventDataType } from '../Models/EventModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/events`

export const getEvents = async (gameId: string, userId: string | undefined): Promise<IEventModel | null> => {
  try {
    const apiUrl = `${baseUrl}/game/account?id=${gameId}&account=${userId}`
    const response: AxiosResponse<IEventModel> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : null
  } catch (error) {
    throw error
  }
}

export const getGameEvents = async (gameId: string): Promise<IEventModel[]> => {
  try {
    const apiUrl = `${baseUrl}/game/events?id=${gameId}`
    const response: AxiosResponse<IEventModel[]> = await axios.get(apiUrl)
    return (response.status === 200)? response.data : []
  } catch (error) {
    throw error
  }
}

export const addEvent = async (
  formData: IEvent,
  events: IEvent[],
): Promise<AxiosResponse<EventDataType>> => {
    try {
    const event: IEvent = {
      id: uuid(),
      eventTime: formData.eventTime,
      advTeam: formData.advTeam,
      eventType: parseInt(formData.eventType.toString()),
      position: parseInt(formData.position.toString()),
      significance: parseInt(formData.significance.toString()),
    }
    events.push(event)

    const syncEvents: AxiosResponse<EventDataType> = {
      data: {
        events: events,
        message: "",
        status: "",
        event: event,
      },
      status: 200,
      statusText: "OK",
      headers: "application/json",
      config: {}
    }

    return syncEvents
  } catch (error) {
    throw new Error(error)
  }
}


export const saveEvents = async (
  events: IEvent[], account: string, email: string, gameId: string, isMaster: boolean
): Promise<string> => {
  try {
    const apiUrl = `${baseUrl}/save`
    const scores: IEventModel = {
      id: uuid(),
      account: account,
      email: email,
      gameId: gameId,
      updatedOn: '',
      isMaster: isMaster,
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


export const deleteEvent = async (
  _id: string
): Promise<AxiosResponse<EventDataType>> => {
  try {
    const deletedEvent: AxiosResponse<EventDataType> = await axios.delete(
      `${baseUrl}/delete-event/${_id}`
    )
    return deletedEvent
  } catch (error) {
    throw new Error(error)
  }
}
