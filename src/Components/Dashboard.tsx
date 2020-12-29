import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dropdown, Text, initializeIcons, IDropdown, IStackTokens, Stack, IStackItemStyles, IDropdownOption } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from '../Auth/AuthProvider'
import { AccessTokenResponse } from 'react-aad-msal';

import { getEvents, addEvent, saveEvents, updateEvent, deleteEvent } from '../API/APIs'
import { IEvent } from '../Models/EventModel'
import AddEvent from '../Components/AddEvent'
import Navigation from '../Components/Navigation'
import EventTable  from '../Components/EventTable'

// Global context
import { navBarContext } from '../NavBar/NavBar.Context'
import { useMenu } from '../NavBar/NavBar.Hook'
import { NIL } from 'uuid';

const dropdownStyles = { dropdown: { width: 500 }, label: { color: 'White' } };
const nonShrinkingStackItemStyles: IStackItemStyles = {
  root: {
    alignItems: 'center',
    display: 'flex',
    height: 500,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 5000,
  },
}

// Initialize icons in case this page uses them
initializeIcons();

const Dashboard: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<IDropdownOption>()
  const [events, setEvents] = useState<IEvent[]>([])
  const [newEvent, setNewEvent] = useState<IEvent | null>(null)
  const [eventCount, addEventCount] = useState(0)
  const [toggled, setToggled] = useState(false)

  const [token, setToken] = useState<string>('')


  const userName = authProvider.getAccountInfo()?.account.userName
  const name = authProvider.getAccountInfo()?.account.name
  const accountId = authProvider.getAccountInfo()?.account.accountIdentifier

  const dropdownRef = React.createRef<IDropdown>();
  const onSetFocus = () => dropdownRef.current!.focus(true);

  const stackTokens: IStackTokens = { childrenGap: 20 };

  authProvider.getAccessToken().then ((value: AccessTokenResponse) => {
    setToken(value.accessToken)
  })

  useEffect(() => {
    fetchEvents().then((totalEvents: number) => {
      addEventCount(totalEvents)  
    })
    onSetFocus()
  },[eventCount])


  useEffect(() => {
    const addEventHandler = async (formData: IEvent): Promise<void> => {
      await addEvent(formData, events)
      .then(({ data }) => {
        setEvents(data.events)
        console.log(`added total of ${events.length} events`)
      })
      .catch((err) => console.log(err))
    }  
    if (toggled && newEvent !== null) {
      addEventHandler(newEvent)
      setToggled(false)
    }
  }, [events, newEvent, toggled])

  const fetchEvents = async (): Promise<number> => {
    const retrievedEvents = await getEvents()
    setEvents(retrievedEvents.data.events)
    return events.length
  }

  const handleAddEvent = (e: React.FormEvent, formData: IEvent): void => {
    e.preventDefault()
    const _form: any = e.currentTarget
    formData = {...formData, eventType: _form.elements[2].value, position: formData.position ?? 0, significance: formData.significance ?? 0}
    setNewEvent(formData)
    setToggled(true)
  }

  const handleSaveEvent = async (e: React.FormEvent, formData: IEvent): Promise<void> => {
    e.preventDefault()
    const _form: any = e.currentTarget
    formData = {...formData, eventType: _form.elements[2].value}
    await saveEvents(formData)
    .then(({ status, data }) => {
      if (status !== 201) {
        throw new Error('Error! Event not saved')
      }
      setEvents(data.events)
    })
    .catch((err) => console.log(err))
  }

  const handleUpdateEvent = (event: IEvent): void => {
    updateEvent(event)
    .then(({ status, data }) => {
      if (status !== 200) {
        throw new Error('Error! Event not updated')
      }
      setEvents(data.events)
    })
    .catch((err) => console.log(err))
  }

  const handleDeleteEvent = (deletedItems: IEvent[]): void => {
    const updatedItemsList = events.filter((item, index) => !deletedItems.includes(item))
    setEvents(updatedItemsList)
  }

  const onGameChanged = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption, index?: number): void => {
    setSelectedGame(item)
    console.log(`Selected: ${item?.text}`)
  }

  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="dash" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="auto">
              <Stack horizontalAlign="center">
                <Dropdown
                  componentRef={dropdownRef}
                  placeholder="Select a game"
                  label="Select a game for which you want to edit significant events"
                  options={[
                    { key: 'CHEBAR', text: 'Chelsea vs Barcelona' },
                    { key: 'ATLSEV', text: 'Athletico vs Sevilia' },
                    { key: 'LIVMC', text: 'Liverpool vs Manchester City' },
                    { key: 'MANARC', text: 'Manchester United vs Arsenal' },
                  ]}
                  required
                  styles={dropdownStyles}
                  onChange={onGameChanged}
                />
              </Stack>
            </Stack.Item>
            <Stack.Item align="auto">
              <Text block className="Title" variant='xxLarge'>{selectedGame?.text}</Text>
            </Stack.Item>
            <Stack.Item align="auto">
              <main className='App'>
                <AddEvent saveEvent={handleAddEvent} />
              </main>
            </Stack.Item>
            <Stack.Item align="stretch">
              {!toggled && <main className='App'>
                <EventTable 
                  events={events} 
                  updateEvent={handleUpdateEvent}
                  deleteItemsEvent={handleDeleteEvent}
                />                  
              </main>}
            </Stack.Item>
          </Stack>
        </div>
        <footer>
          <h2>Environment: {process.env.NODE_ENV}</h2>
          <h2>Events Total: {events.length}</h2>
          <h2>AccountId: {accountId}</h2>
          <h2>UserName: {userName}</h2>
          <h2>Display Name: {name}</h2>
        </footer>
    </div>      
  )
}

export default Dashboard
