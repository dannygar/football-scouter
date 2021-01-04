import { v4 as uuid } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import { IEvent, EventDataType } from '../Models/EventModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/events`

export const getEvents = async (gameId: string, userId: string | undefined): Promise<IEvent[]> => {
  try {
    const apiUrl = `${baseUrl}/game?Id=${gameId}&account=${userId}`
    const response: AxiosResponse<IEvent[]> = await axios.get(apiUrl)
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
      time: formData.time,
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
  events: IEvent[]
): Promise<string> => {
  try {
    const apiUrl = `${baseUrl}/save`
    const response: AxiosResponse<boolean> = await axios.post(
      apiUrl,
      events
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
