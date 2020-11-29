import React, { useState } from 'react'
import '../Styles/App.css';
import { EventType, IEvent } from '../Models/EventModel'
import EventTypeDropDown from './EventTypeDropDown'

  
type Props = { 
  saveEvent: (e: React.FormEvent, formData: IEvent | any) => void 
}

const AddEvent: React.FC<Props> = ({ saveEvent }) => {
  const [formData, setFormData] = useState<IEvent | {}>()

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
    })
  }

  return (
    <div className="container">
        <form className='Form' onSubmit={(e) => saveEvent(e, formData)}>
        <div>
            <div>
              <label htmlFor='time'>Event Time</label>
              <input onChange={handleForm} type='text' id='time' />
            </div>
            <div>
              <label htmlFor='advTeam'>Adv Team</label>
              <input onChange={handleForm} type='text' id='advTeam' />
            </div>
            <div>
              <label htmlFor='eventType'>Event Type</label>
              <EventTypeDropDown onChange={handleForm} type='number' id='eventType' />
            </div>
            <div>
              <label htmlFor='position'>Position</label>
              <input onChange={handleForm} type='number' id='position' />
            </div>
            <div>
              <label htmlFor='significance'>Significance</label>
              <input onChange={handleForm} type='number' id='significance' />
            </div>
            <div>
              <label htmlFor='credit'>Credit</label>
              <input onChange={handleForm} type='string' id='credit' />
            </div>
            <div>
              <label htmlFor='blame'>Blame</label>
              <input onChange={handleForm} type='string' id='blame' />
            </div>
            <div>
              <label htmlFor='comments'>Comments</label>
              <input onChange={handleForm} type='string' id='comments' />
            </div>
        </div>
        <button disabled={formData === undefined ? true: false} >Add</button>
        </form>
    </div>
  )
}

export default AddEvent
