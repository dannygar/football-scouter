import React, { useEffect, useState } from 'react'
import '../Styles/App.css';
import { IEvent, getEventTypes } from '../Models/EventModel'
import EventTypeDropDown from './EventTypeDropDown'
import { IGame } from '../Models/GameModel';
import { MaskedTextField, mergeStyleSets } from '@fluentui/react';

const inputTextClass = mergeStyleSets({
  control: {
    margin: '5px 15px 0 0',
    minWidth: '60px',
    maxWidth: '90px',
  },
})
  
type Props = { 
  saveEvent: (e: React.FormEvent, formData: IEvent | any) => void 
  game: IGame
}

const initTeams = (props: IGame): any[] => {
  return [
      {
          label: props?.homeTeam ?? 'Home Team',
          value: props?.homeTeam ?? '0'
      },
      {
          label: props?.awayTeam ?? 'Away Team',
          value: props?.awayTeam ?? '1'
      },
  ] 
}


const AddEvent: React.FC<Props> = ({ saveEvent, game }) => {
  const [formData, setFormData] = useState<IEvent | {}>()
  const [teams, setTeams] = useState<any[]>(initTeams(game))

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value
    })
  }

  const handleMaskedTextInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: any): void => {
    setFormData({
      ...formData,
      eventTime: Number.parseFloat(newValue)
    })
  }

  useEffect(() => {
    if (game && (teams[0].value !== game.homeTeam || teams[1].value !== game.awayTeam)) {
      setTeams(initTeams(game))
    }
  }, [game, teams])

  return (
    <div className="container">
        <form className='Form' onSubmit={(e) => saveEvent(e, formData)}>
        <div>
            <div>
              <label htmlFor='eventTime'>Event Time</label>
              <MaskedTextField 
                className={inputTextClass.control} 
                mask='99.99' 
                required 
                onChange={handleMaskedTextInput} 
                id='eventTime' 
                borderless={true}
              />
            </div>
            <div>
              <label htmlFor='advTeam'>Adv Team</label>
              <EventTypeDropDown onChange={handleForm} type='text' id='advTeam' items={teams} />
            </div>
            <div>
              <label htmlFor='eventType'>Event Type</label>
              <EventTypeDropDown onChange={handleForm} type='number' id='eventType' items={getEventTypes()} />
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
