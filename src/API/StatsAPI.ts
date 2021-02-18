import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import IGoldCircleModel from '../Models/GoldCircleModel'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/stats`

export const getGoldCircle = async (gameId: string, token: string): Promise<IGoldCircleModel | null> => {
  try {
    const apiUrl = `${baseUrl}/goldcircle?id=${gameId}`
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<IGoldCircleModel> = await axios.get(apiUrl, config)
    return (response.status === 200)? response.data : null
  } catch (error) {
    return null
  }
}

export const saveGoldCircle = async (goldCircle: IGoldCircleModel, token: string): Promise<string> => {
  try {
    const apiUrl = `${baseUrl}/goldcircle/save`
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<boolean> = await axios.post(
      apiUrl,
      goldCircle,
      config
    )
    return response ? 'Saved' : 'Failed'
  } catch (error) {
    return error
  }
}



