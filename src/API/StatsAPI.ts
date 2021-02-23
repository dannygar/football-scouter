import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import IGoldCircleModel from '../Models/GoldCircleModel'

const apiUrl = process.env.REACT_APP_API_URL as string
const controllerUrl: string = apiUrl.charAt(apiUrl.length - 1) === '/' ? 'api/stats' : '/api/stats'
const baseUrl = `${apiUrl}${controllerUrl}`

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



