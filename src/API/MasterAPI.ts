import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

const apiUrl = process.env.REACT_APP_API_URL as string
const controllerUrl: string = apiUrl.charAt(apiUrl.length - 1) === '/' ? 'api/masters' : '/api/masters'
const baseUrl = `${apiUrl}${controllerUrl}`

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
