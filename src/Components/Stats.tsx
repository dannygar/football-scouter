/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Dropdown, Text, IDropdown, IStackTokens, Stack, IDropdownOption, ActionButton, IIconProps } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from '../Auth/AuthProvider'
import { AccessTokenResponse } from 'react-aad-msal';

import { getEvents, addEvent, saveEvents } from '../API/EventAPI'
import { IEvent } from '../Models/EventModel'
import AddEvent from './AddEvent'
import Navigation from './Navigation'
import EventTable  from './EventTable'
import { IGame } from '../Models/GameModel';

// Global context
// import { navBarContext } from '../NavBar/NavBar.Context'
// import { useMenu } from '../NavBar/NavBar.Hook'
// import { NIL } from 'uuid';
import { getGames } from '../API/GameAPI';
import { getGameStats } from '../API/ScoreAPI';
import { IScoreModel } from '../Models/ScoreModel';
import StatsTable from './StatsTable';

const dropdownStyles = { dropdown: { width: 500 }, label: { color: 'White' } };

const signIcon: IIconProps = { iconName: 'SignIn' };

type StatsProps = {
  userName: string
}

const Stats: React.FC<StatsProps> = (props) => {
  const [readOnly, ] = useState<boolean>(!(props.userName === process.env.REACT_APP_ADMIN ?? ''))
  const [selectedGame, setSelectedGame] = useState<IGame>()
  const [games, setGames] = useState<IGame[]>([])
  const [gamesList, setGamesList] = useState<IDropdownOption[]>([])
  const [gameStats, setGameStats] = useState<IScoreModel[]>([])
  const [newEvent, setNewEvent] = useState<IEvent | null>(null)
  const [toggled, setToggled] = useState(false)
  const [eventsLoaded, setEventsLoaded] = useState(false)
  const [signedIn, setSignedStatus] = useState(false)
  const [userName, setUserName] = useState<string | undefined>()
  const [displayName, setDisplayName] = useState<string | undefined>()
  const [statusMsg, setStatusMsg] = useState<string>('')


  
  // const name = authProvider.getAccountInfo()?.account.name
  const accountId = authProvider.getAccountInfo()?.account.accountIdentifier
  
  const stackTokens: IStackTokens = { childrenGap: 20 };


  const authenticate = (): void => {
    authProvider.getAccessToken().then ((value: AccessTokenResponse) => {
      setUserName(authProvider.getAccountInfo()?.account.userName)
      setDisplayName(authProvider.getAccountInfo()?.account.name)
      setSignedStatus((userName && userName.length > 0) ? true : false)
    })
  }
  authenticate()

  const dropdownRef = React.createRef<IDropdown>();

  useEffect(() => {
    console.log("Component Did Mount")
    try {
      const fetchGames = async (): Promise<void> => {
        const retrievedGames = await getGames()
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
    const changeGoldenCircleHandler = async (gameId: string): Promise<void> => {
      try {
        const gameStats = await getGameStats(gameId)
        if (gameStats) {
          setGameStats(gameStats)
        } else {
          setGameStats([])
        }
        setEventsLoaded(true)
        console.log("scores have been updated")
      } catch (error) {
          if (error.response?.status !== 404)
            alert(`Failed to fetch all significances for this game. Please try again later. Error details: ${error.message}`)      
      }
    }

    if (toggled && newEvent !== null) {
      changeGoldenCircleHandler(selectedGame?.id as string)
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


  const handleSaveEvent = async (scores: IScoreModel[]):  Promise<string>  => {
    return "OK"
    // return await saveEvents(events, accountId as string, userName as string, (selectedGame as IGame).id)
  }

  const onGameChanged = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption, index?: number): void => {
    if (item && item.data) {
      setSelectedGame(item.data)
      const fetchScores = async (gameId: string): Promise<void> => {
        try {
          const gameStats = await getGameStats(gameId)
          if (gameStats) {
            setGameStats(gameStats)
          } else {
            setGameStats([])
          }
          setEventsLoaded(true)
          console.log("scores have been updated")
      } catch (error) {
          if (error.response?.status !== 404)
            alert(`Failed to fetch all significances for this game. Please try again later. Error details: ${error.message}`)      
        }
      }

      fetchScores(item.data?.id)
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
                  <StatsTable 
                    gameStats={gameStats} 
                    saveStats={handleSaveEvent}
                  />                  
                }
              </main>}
            </Stack.Item>
          </Stack>
        </div>
    </div>      
  )
}

export default Stats
