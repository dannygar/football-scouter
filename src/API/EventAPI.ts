import { v4 as uuid } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import { IEvent, EventDataType, EventType } from '../Models/EventModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/events`

export const getEvents = async (): Promise<AxiosResponse<EventDataType>> => {
  try {
    const events: AxiosResponse<EventDataType> = {
      data: {
        events: [
          {
            id: uuid(),
            time: "05.23",
            advTeam: "Chelsea",
            eventType: EventType.PEP,
            position: 14,
            significance: 40,
            comments: "Successful dribbling with the 3rd defensive line penetration "
          },
          {
            id: uuid(),
            time: "06.45",
            advTeam: "Chelsea",
            eventType: EventType.DIS,
            position: 8,
            significance: 56,
          },
        ],
        message: "",
        status: "",
        event: {
          id: uuid(),
          time: "05.23",
          advTeam: "Chelsea",
          eventType: EventType.RUN,
          position: 14,
          significance: 40,
        },
      },
      status: 200,
      statusText: "OK",
      headers: "application/json",
      config: {}
    }
    // const events: AxiosResponse<EventDataType> = await axios.get(
    //   baseUrl + '/events'
    // )
    return events
  } catch (error) {
    throw new Error(error)
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
