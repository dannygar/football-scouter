import React, { useState } from 'react'
import { DatePicker, DayOfWeek, Checkbox, mergeStyleSets } from '@fluentui/react'

import '../Styles/App.css';
// import { IEvent, getEventTypes } from '../Models/EventModel'
// import EventTypeDropDown from './EventTypeDropDown'
import { IGame } from '../Models/GameModel'
import { DayPickerStrings, parseDateFromString } from '../Utils/DateTimeUtil'


const datePickerClass = mergeStyleSets({
  control: {
    margin: '5px 15px 0 0',
    minWidth: '200px',
    maxWidth: '300px',
  },
})

const checkBoxClass = mergeStyleSets({
  control: {
    margin: '15px 25px 0 0',
    minWidth: '50px',
    maxWidth: '100px',
  },
})


type Props = { 
  addGame: (e: React.FormEvent, formData: IGame | any) => void 
}


const AddGame: React.FC<Props> = ({ addGame }) => {
  const [formData, setFormData] = useState<IGame | {}>()
  const [isChecked, setIsChecked] = React.useState(true)
  const [gameDate, setGameDate] = React.useState<Date | null | undefined>(null);

  const onSelectDate = (date: Date | null | undefined): void => {
    setGameDate(date)
  }

  const handleForm = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.id]: e.currentTarget.value,
      fullGame: isChecked,
      playedOn: gameDate
    })
  }

  const onDateChange = React.useCallback((ev?: React.FormEvent<HTMLElement>, date?: Date): void => {
    setGameDate(date)
    setFormData({...formData, playedOn: date})
  }, []);

  const onCheckboxChange = React.useCallback((ev?: React.FormEvent<HTMLElement>, checked?: boolean): void => {
    setIsChecked(!!checked)
    // if (ev) {
    //   handleForm(ev as React.FormEvent<HTMLInputElement>)
    // }
  }, []);

  const onFormatDate = (date?: Date): string => {
    return !date ? '' : date.toLocaleDateString()
    //return !date ? '' : (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear());
  }

  return (
    <div className="container">
        <form className='Form' onSubmit={(e) => addGame(e, formData)}>
        <div>
            <div>
              <label htmlFor='homeTeam'>Home Team</label>
              <input onChange={handleForm} type='text' id='homeTeam' />
            </div>
            <div>
              <label htmlFor='awayTeam'>Away Team</label>
              <input onChange={handleForm} type='text' id='awayTeam' />
            </div>
            <div>
              <label htmlFor='league'>League Name</label>
              <input onChange={handleForm} type='text' id='league' />
            </div>
            <div>
              <label htmlFor='playedOn'>Played On</label>
              <DatePicker
                id='playedOn'
                className={datePickerClass.control}
                firstDayOfWeek={DayOfWeek.Sunday}
                strings={DayPickerStrings}
                placeholder="Select a date..."
                ariaLabel="Select a date"
                isRequired={false}
                allowTextInput={true}
                value={gameDate!}
                onChange={onDateChange}
                // eslint-disable-next-line react/jsx-no-bind
                onSelectDate={onSelectDate}
                formatDate={onFormatDate}
                // eslint-disable-next-line react/jsx-no-bind
                parseDateFromString={parseDateFromString}
              />
            </div>
            <div>
              <label htmlFor='fullGame'>Full IGame</label>
              <Checkbox id='fullGame' className={checkBoxClass.control} checked={isChecked} onChange={onCheckboxChange} />
            </div>
        </div>
        <button disabled={formData === undefined ? true: false} >Add</button>
        </form>
    </div>
  )
}

export default AddGame
