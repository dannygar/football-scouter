import React, { useState } from 'react'
import { ISignificance } from '../Models/SignificanceModel'
import SignificanceTypeDropDown from './SignificanceTypeDropDown'

type Props = { 
  saveSignificance: (e: React.FormEvent, formData: ISignificance | any) => void 
}

const AddSignificance: React.FC<Props> = ({ saveSignificance }) => {
  const [formData, setFormData] = useState<ISignificance | {}>()

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  return (
    <form className='Form' onSubmit={(e) => saveSignificance(e, formData)}>
      <div>
        <div>
          <label htmlFor='time'>Time: </label>
          <input onChange={handleForm} type='decimal' id='time' />
        </div>
        <div>
          <label htmlFor='advTeam'>Advantage Team: </label>
          <input onChange={handleForm} type='text' id='advTeam' />
        </div>
        <div>
          <label htmlFor='sigType'>Sig. Type: </label>
          <SignificanceTypeDropDown onChange={handleForm} type='number' id='sigType' />
        </div>
        <div>
          <label htmlFor='position'>Position: </label>
          <input onChange={handleForm} type='number' id='position' />
        </div>
        <div>
          <label htmlFor='significance'>Sig. Score: </label>
          <input onChange={handleForm} type='number' id='significance' />
        </div>
      </div>
      <button disabled={formData === undefined ? true: false} >Add</button>
    </form>
  )
}

export default AddSignificance
