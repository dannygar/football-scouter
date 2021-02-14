import axios, { AxiosResponse } from 'axios'

const baseUrl: string = `${process.env.REACT_APP_API_URL}/api/masters`

export const isMaster = async (accountId: string): Promise<boolean> => {
  try {
    const apiUrl = `${baseUrl}?id=${accountId}`
    const response: AxiosResponse<boolean> = await axios.get(apiUrl)

    return (response.status === 200)? response.data : false
  } catch (error) {
    throw error
  }
}
