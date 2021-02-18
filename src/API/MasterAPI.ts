import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/masters`

export const isMaster = async (accountId: string, token: string): Promise<boolean> => {
  try {
    const apiUrl = `${baseUrl}?id=${accountId}`
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response: AxiosResponse<boolean> = await axios.get(apiUrl, config)

    return (response.status === 200)? response.data : false
  } catch (error) {
    throw error
  }
}
