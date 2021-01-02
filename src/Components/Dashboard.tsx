import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dropdown, Text, initializeIcons, IDropdown, IStackTokens, Stack, IDropdownOption, ActionButton, IIconProps } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from '../Auth/AuthProvider'
import { AccessTokenResponse } from 'react-aad-msal';

import { getEvents, addEvent, saveEvents } from '../API/EventAPI'
import { IEvent } from '../Models/EventModel'
import AddEvent from '../Components/AddEvent'
import Navigation from '../Components/Navigation'
import EventTable  from '../Components/EventTable'
import { IGame } from '../Models/GameModel';

// Global context
import { navBarContext } from '../NavBar/NavBar.Context'
import { useMenu } from '../NavBar/NavBar.Hook'
import { NIL } from 'uuid';
import { getGames } from '../API/GameAPI';

const dropdownStyles = { dropdown: { width: 500 }, label: { color: 'White' } };

const signIcon: IIconProps = { iconName: 'SignIn' };

// Initialize icons in case this page uses them
initializeIcons();

const Dashboard: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<IGame>()
  const [games, setGames] = useState<IGame[]>([])
  const [gamesList, setGamesList] = useState<IDropdownOption[]>([])
  const [events, setEvents] = useState<IEvent[]>([])
  const [newEvent, setNewEvent] = useState<IEvent | null>(null)
  const [eventCount, addEventCount] = useState(0)
  const [toggled, setToggled] = useState(false)
  const [signedIn, setSignedStatus] = useState(false)
  const [token, setToken] = useState<string>('')
  const [userName, setUserName] = useState<string | undefined>()
  const [displayName, setDisplayName] = useState<string | undefined>()


  
  // const name = authProvider.getAccountInfo()?.account.name
  // const accountId = authProvider.getAccountInfo()?.account.accountIdentifier
  
  const stackTokens: IStackTokens = { childrenGap: 20 };

  const authenticate = (): void => {
    authProvider.getAccessToken().then ((value: AccessTokenResponse) => {
      setToken(value.accessToken)
      setUserName(authProvider.getAccountInfo()?.account.userName)
      setDisplayName(authProvider.getAccountInfo()?.account.name)
      setSignedStatus((userName && userName.length > 0) ? true : false)
    })
  }
  authenticate()

  const dropdownRef = React.createRef<IDropdown>();
  const onSetFocus = () => dropdownRef.current!.focus(true);

  const fetchGames = async (): Promise<number> => {
    const retrievedGames = await getGames()
    setGames(retrievedGames)
    const gameOptions: IDropdownOption[] = []
    retrievedGames.forEach(game => {
      gameOptions.push({ key: game.id, text: `${game.homeTeam} vs ${game.awayTeam}`,
        data: game })
    })
    setGamesList(gameOptions)
    return games.length
  }
  fetchGames()


  useEffect(() => {
    fetchEvents().then((totalEvents: number) => {
      addEventCount(totalEvents)  
    })
    onSetFocus()
  },[eventCount, selectedGame])


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
    formData = {...formData, advTeam: _form.elements[1].value, eventType: _form.elements[2].value, position: formData.position ?? 0, significance: formData.significance ?? 0}
    setNewEvent(formData)
    setToggled(true)
  }


  const handleSaveEvent = async (events: IEvent[]):  Promise<string>  => {
    const result = await saveEvents(events)
    return result
  }

  const handleDeleteEvent = (deletedItems: IEvent[]): void => {
    const updatedItemsList = events.filter((item, index) => !deletedItems.includes(item))
    setEvents(updatedItemsList)
  }

  const onGameChanged = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption, index?: number): void => {
    if (item && item.data) {
      setSelectedGame(item.data)
    }
    console.log(`Selected: ${item?.text}`)
  }

  const onSignInOutClicked = (): void => {
    if (signedIn) {
      authProvider.logout()
      setSignedStatus(false)
    } else {
      authProvider.login()
      authenticate()
    }
  }

  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="dash" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="end">
              <Text className="Header">{displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={signedIn ? 'Sign Out' : 'Sign In'} iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={onSignInOutClicked} />
            </Stack.Item>
            <Stack.Item align="auto">
              <Stack horizontalAlign="center">
                <Dropdown
                  componentRef={dropdownRef}
                  placeholder="Select a game"
                  label="Select a game for which you want to edit significant events"
                  options={gamesList}
                  required
                  styles={dropdownStyles}
                  onChange={onGameChanged}
                />
              </Stack>
            </Stack.Item>
            <Stack.Item align="auto">
              <Text block className="Title" variant='xxLarge'>{selectedGame?.homeTeam} vs {selectedGame?.awayTeam}</Text>
            </Stack.Item>
            <Stack.Item align="auto">
              <main className='App'>
                <AddEvent saveEvent={handleAddEvent} game={selectedGame as IGame} />
              </main>
            </Stack.Item>
            <Stack.Item align="stretch">
              {!toggled && <main className='App'>
                <EventTable 
                  events={events} 
                  saveEvents={handleSaveEvent}
                  deleteItemsEvent={handleDeleteEvent}
                />                  
              </main>}
            </Stack.Item>
          </Stack>
        </div>
        <footer>
          <h2>Environment: {process.env.NODE_ENV}</h2>
        </footer>
    </div>      
  )
}

export default Dashboard
