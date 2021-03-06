/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { Dropdown, Text, IDropdown, IStackTokens, Stack, IDropdownOption, ActionButton, IIconProps } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authContext } from '../Auth/AuthProvider'

import { getEvents, addEvent, saveEvents } from '../API/EventAPI'
import { IEvent } from '../Models/EventModel'
import AddEvent from '../Components/AddEvent'
import Navigation from '../Components/Navigation'
import EventTable  from '../Components/EventTable'
import { IGame } from '../Models/GameModel';

// Global context
// import { navBarContext } from '../NavBar/NavBar.Context'
// import { useMenu } from '../NavBar/NavBar.Hook'
// import { NIL } from 'uuid';
import { getGames } from '../API/GameAPI';

const dropdownStyles = { dropdown: { width: 500 }, label: { color: 'Blue' } };
const signIcon: IIconProps = { iconName: 'SignIn' };
const stackTokens: IStackTokens = { childrenGap: 20 };
const dropdownRef = React.createRef<IDropdown>();

const Dashboard: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<IGame>()
  const [games, setGames] = useState<IGame[]>([])
  const [gamesList, setGamesList] = useState<IDropdownOption[]>([])
  const [events, setEvents] = useState<IEvent[]>([])
  const [newEvent, setNewEvent] = useState<IEvent | null>(null)
  const [toggled, setToggled] = useState(false)
  const [eventsLoaded, setEventsLoaded] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string>('')

  // Get Auth Context
  const authUserContext = useContext(authContext)

  useEffect(() => {
    console.log("Component Did Mount")
    try {
      const fetchGames = async (): Promise<void> => {
        const retrievedGames = await getGames(authUserContext.authUser.token)
        if (retrievedGames.length === 0) {
          setStatusMsg("Failed to retrieve the list of games")
          return
        }
        const gameOptions: IDropdownOption[] = []
        retrievedGames.forEach(game => {
          gameOptions.push({ key: game.id, text: `${game.homeTeam} vs ${game.awayTeam}`,
            data: game })
        })
        setGamesList(gameOptions)
        setGames(retrievedGames)
        setEventsLoaded(true)
        if(dropdownRef.current !== null) {
          const onSetFocus = () => dropdownRef.current!.focus(true);
          onSetFocus()
        }
      }
      fetchGames()
    } catch (error) {
      setStatusMsg("Failed to retrieve the list of games")
    }
  }, [])

  useEffect(() => {
    console.log("Component is updated")
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
  })


  const handleAddEvent = (e: React.FormEvent, formData: IEvent): void => {
    e.preventDefault()
    const _form: any = e.currentTarget
    formData = {...formData, advTeam: _form.elements[1].value, eventType: _form.elements[2].value, position: formData.position ?? 0, significance: formData.significance ?? 0}
    setNewEvent(formData)
    setToggled(true)
  }


  const handleSaveEvent = async (events: IEvent[]):  Promise<string>  => {
    return await saveEvents(
      events, 
      authUserContext.authUser.id as string, 
      authUserContext.authUser.userName as string, 
      (selectedGame as IGame).id, 
      false,
      authUserContext.authUser.token)
    // return await saveEvents(events, props.user.id as string, props.user.userName as string, (selectedGame as IGame).id, false)
  }

  const handleDeleteEvent = (deletedItems: IEvent[]): void => {
    const updatedItemsList = events.filter((item, index) => !deletedItems.includes(item))
    setEvents(updatedItemsList)
  }

  const onGameChanged = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption, index?: number): void => {
    if (item && item.data) {
      setSelectedGame(item.data)
      const fetchEvents = async (gameId: string): Promise<void> => {
        try {
          const retrievedEvents = await getEvents(gameId, authUserContext.authUser.id, authUserContext.authUser.token)
          // const retrievedEvents = await getEvents(gameId, props.user.id)
          if (retrievedEvents) {
            setEvents(retrievedEvents.events)
          } else {
            setEvents([])
          }
          setEventsLoaded(true)
          console.log("events have been updated")
      } catch (error) {
          if (error.response?.status !== 404)
            alert(`Failed to fetch all significances for this game. Please try again later. Error details: ${error.message}`)      
        }
      }

      fetchEvents(item.data?.id)
    }
    console.log(`Selected: ${item?.text}`)
  }

  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="dash" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="end">
              <Text className="Header">{authUserContext.authUser.displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={authUserContext.authUser.isSigned ? 'Sign Out' : 'Sign In'} iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={authUserContext.onSignInOutClicked} />
              {/* <Text className="Header">{props.user.displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={props.user.isSigned ? 'Sign Out' : 'Sign In'} iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={onSignInOutClicked} /> */}
            </Stack.Item>
            <Stack horizontalAlign="center">
              <Stack.Item align="auto">
                <Dropdown
                  componentRef={dropdownRef}
                  placeholder={eventsLoaded ? ( games.length > 0 ? "Select a game" : "No games found") : "please, wait..."}
                  label="Select a game for which you want to edit significant events"
                  options={gamesList}
                  required
                  styles={dropdownStyles}
                  onChange={onGameChanged}
                />
                {eventsLoaded ? (games.length > 0 ? (
                <Stack.Item align="auto">
                  <Text block className="Title" variant='xxLarge'>{selectedGame?.homeTeam} vs {selectedGame?.awayTeam}</Text>
                </Stack.Item> ) : (
                  <br/>
                )
                ) : (
                  <Stack.Item align="auto">
                    <Text block className="Title" variant='xxLarge'>Loading...</Text>
                  </Stack.Item>
                ) }
              </Stack.Item>
            </Stack>
            <Stack.Item align="auto">
              <main className='App'>
                <AddEvent saveEvent={handleAddEvent} game={selectedGame as IGame} />
              </main>
            </Stack.Item>
            <Stack.Item align="stretch">
              {!toggled && <main className='App'>
                {eventsLoaded && 
                  <EventTable 
                    events={events} 
                    saveEvents={handleSaveEvent}
                    deleteItemsEvent={handleDeleteEvent}
                  />                  
                }
              </main>}
            </Stack.Item>
          </Stack>
        </div>
        <footer>
          <h2>Environment: {process.env.NODE_ENV}</h2>
          <h4>{statusMsg}</h4>
        </footer>
    </div>      
  )
}

export default Dashboard
