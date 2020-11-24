import axios, { AxiosResponse } from 'axios'
import { ISignificance, SignificanceDataType } from '../Models/SignificanceModel'

const baseUrl: string = 'http://localhost:4000'

export const getSignificances = async (): Promise<AxiosResponse<SignificanceDataType>> => {
  try {
    const significances: AxiosResponse<SignificanceDataType> = await axios.get(
      baseUrl + '/significances'
    )
    return significances
  } catch (error) {
    throw new Error(error)
  }
}

export const addSignificance = async (
  formData: ISignificance
): Promise<AxiosResponse<SignificanceDataType>> => {
  try {
    const significance: Omit<ISignificance, 'id'> = {
        time: formData.time,
        advTeam: formData.advTeam,
        sigType: formData.sigType,
        position: formData.position,
        significance: formData.significance,
        status: false,
    }
    const saveSignificance: AxiosResponse<SignificanceDataType> = await axios.post(
      baseUrl + '/add-significance',
      significance
    )
    return saveSignificance
  } catch (error) {
    throw new Error(error)
  }
}

export const updateSignificance = async (
  significance: ISignificance
): Promise<AxiosResponse<SignificanceDataType>> => {
  try {
    const significanceUpdate: Pick<ISignificance, 'status'> = {
      status: true,
    }
    const updatedSignificance: AxiosResponse<SignificanceDataType> = await axios.put(
      `${baseUrl}/edit-significance/${significance.id}`,
      significanceUpdate
    )
    return updatedSignificance
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteSignificance = async (
  _id: string
): Promise<AxiosResponse<SignificanceDataType>> => {
  try {
    const deletedSignificance: AxiosResponse<SignificanceDataType> = await axios.delete(
      `${baseUrl}/delete-significance/${_id}`
    )
    return deletedSignificance
  } catch (error) {
    throw new Error(error)
  }
}
