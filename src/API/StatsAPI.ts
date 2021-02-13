import axios, { AxiosResponse } from 'axios'
import IGoldCircleModel from '../Models/GoldCircleModel'

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



