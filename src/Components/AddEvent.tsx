import React, { useEffect, useState } from 'react'
import '../Styles/App.css';
import { IEvent, getEventTypes } from '../Models/EventModel'
import EventTypeDropDown from './EventTypeDropDown'
import { Game } from '../Models/Game';

  
type Props = { 
  saveEvent: (e: React.FormEvent, formData: IEvent | any) => void 
  game: Game
}

const initTeams = (props: Game): any[] => {
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
      [e.currentTarget.id]: e.currentTarget.value,
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
              <label htmlFor='time'>Event Time</label>
              <input onChange={handleForm} type='text' id='time' />
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
