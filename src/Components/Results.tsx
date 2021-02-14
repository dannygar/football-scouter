/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Dropdown, Text, IDropdown, IStackTokens, Stack, IDropdownOption, ActionButton, IIconProps } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from '../Auth/AuthProvider'
import { Bar } from '@reactchartjs/react-chart.js'
import { v4 as uuid } from 'uuid'
import { Confirm } from 'react-st-modal'

import { addEvent, saveEvents, getGameEvents, getEvents } from '../API/EventAPI'
import { IEvent, IEventModel } from '../Models/EventModel'
import AddEvent from './AddEvent'
import Navigation from './Navigation'
import { IGame } from '../Models/GameModel'

// Global context
// import { navBarContext } from '../NavBar/NavBar.Context'
// import { useMenu } from '../NavBar/NavBar.Hook'
// import { NIL } from 'uuid';
import { getGames } from '../API/GameAPI';
import { getGameStats } from '../API/ScoreAPI';
import StatsTable from './StatsTable';
import IConsensusModel from '../Models/ConsensusModel';
import EventTable from './EventTable';
import IGoldCircleModel from '../Models/GoldCircleModel';
import { getGoldCircle, saveGoldCircle } from '../API/StatsAPI';
import { Agent } from '../Models/Agent';

const dropdownStyles = { dropdown: { width: 500 }, label: { color: 'Blue' } };
const stackTokens: IStackTokens = { childrenGap: 20 };
const signIcon: IIconProps = { iconName: 'SignIn' };

type AuthProps = {
  user: Agent
  authenticate: () => Promise<void>
}


const Results: React.FC<AuthProps> = (props) => {
  const [selectedGame, setSelectedGame] = useState<IGame>()
  const [games, setGames] = useState<IGame[]>([])
  const [gamesList, setGamesList] = useState<IDropdownOption[]>([])
  const [gamesLoaded, setGamesLoaded] = useState(false)
  const [isInitialized, setInitialized] = useState(false)
  const [isChartChanged, setChartChanged] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string>('')
  const [chartData, setChartData] = useState({})
  const [gameEvents, setGameEvents] = useState<IEventModel[]>([])
  const [goldenCircle, setGoldenCircle] = useState<IGoldCircleModel | null>(null)
  const [events, setEvents] = useState<IEvent[]>([])
  const [newEvent, setNewEvent] = useState<IEvent | null>(null)
  const [toggled, setToggled] = useState(false)
  
  const dropdownRef = React.createRef<IDropdown>()

  const renderConsensusResults = async (consensus: IConsensusModel[]): Promise<void> => {
    console.log("Rendering Consensus results...")
    try {
      const events = consensus.flatMap(i => i.time)
      const uniqueTimes = [...new Set(events)]
      const filteredTimes = uniqueTimes.filter(t => consensus.findIndex(s => s.time === t) >= 0)
      const consensusEvents: IEvent[] = []
      filteredTimes.forEach(time => {
        consensusEvents.push( {
          id: uuid(),
          eventTime: time,
          eventType: 0,
          advTeam: '',
          position: 0,
          significance: 0,
          credit: '',
          blame: '',
          comments: ''
        })
      })
      setEvents(consensusEvents)
      console.log("The Events have been updated from the Consensus Data")
    } catch (error) {
        if (error.response?.status !== 404)
          alert(`Failed to fetch all significances for this game. Please try again later. Error details: ${error.message}`)      
    }
  }

  useEffect(() => {
    console.log("Component Did Mount")
    try {
      const fetchGames = async (): Promise<boolean> => {
        const retrievedGames = await getGames()
        if (retrievedGames.length === 0) {
          setStatusMsg("Failed to retrieve the list of games")
          return false
        }
        const gameOptions: IDropdownOption[] = []
        retrievedGames.forEach(game => {
          gameOptions.push({ key: game.id, text: `${game.homeTeam} vs ${game.awayTeam}`,
            data: game })
        })
        setGamesList(gameOptions)
        setGames(retrievedGames)
        setGamesLoaded(true)
        if(dropdownRef.current !== null) {
          const onSetFocus = () => dropdownRef.current!.focus(true);
          onSetFocus()
        }
        return true
      }
      fetchGames()
      // setInitialized(true)
    } catch (error) {
      setStatusMsg("Failed to retrieve the list of games")
    }
  }, [])

  useEffect(() => {
    console.log("Component is updated")
    console.log(isInitialized? 'isInitialized is true' : 'isInitialized is false')
    const changeGameStatsHandler = async (gameId: string): Promise<void> => {
      try {
        // setInitialized(true)
        console.log(`retrieving game stats for ${goldenCircle?.agentIds.length} scores`)
        const stats = await getGameStats(gameId, goldenCircle?.agentIds as string[])

        if (isChartChanged) {
          updateChart(stats)
          setChartChanged(false)
          if (props.user.isMaster) await renderConsensusResults(stats)
        }
      } catch (error) {
          if (error.response?.status !== 404)
            alert(`Failed to fetch all significances for this game. Please try again later. Error details: ${error.message}`)      
      }
    }

    const updateChart = (consensus: IConsensusModel[]): void => {
      console.log(`updating chart with ${consensus.length} data points`)
      const chartData = {
        labels: consensus.map(a => a.time),
        datasets: [
          {
            data: consensus.map(a => a.eventsCount),
            backgroundColor: 'cyan',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            barPercentage: 0.2,
          },
        ],
      }

      setChartData(chartData)
      console.log(`total of data: ${chartData.datasets[0].data.length}`)
      console.log("Consensus Chart has been updated")
    }

    if (goldenCircle && (!isInitialized || isChartChanged)) {
      changeGameStatsHandler(selectedGame?.id as string)
      setChartChanged(false)
    }

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


  const onGameChanged = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption, index?: number): void => {
    if (item && item.data) {
      setSelectedGame(item.data)
      const fetchScores = async (gameId: string): Promise<void> => {
        try {
          // get game's all events
          const gameEvents = await getGameEvents(gameId)
          setGameEvents(gameEvents)
          setInitialized(false)

          // get game's stats
          let stats: IConsensusModel[]
          const goldenCircle = await getGoldCircle(gameId)
          if (goldenCircle !== null) {
            stats = await getGameStats(gameId, goldenCircle.agentIds)
            setGoldenCircle(goldenCircle)
          }
          else {
            const agentKeys: string[] = []
            gameEvents.map(gameEvent => {
              agentKeys.push(gameEvent.account)
              return agentKeys
            }) 
            stats = await getGameStats(gameId, agentKeys)
          }

          if (stats) {
            if (props.user.isMaster) {
              // Get consensus events
              const retrievedEvents = await getEvents(gameId, props.user.id)
              if (retrievedEvents) {
                const loadFromDb = await Confirm(
                  "Already saved significance events found. Load them instead?", 
                  "Consensus Data", 
                  "Load Saved Events",
                  "Load from the current Consensus")
                if (loadFromDb) {
                  setEvents(retrievedEvents.events)
                } else {
                  await renderConsensusResults(stats)
                }
              } else {
                await Confirm(
                  "No saved Consensus events found. Rendering Consensus data", 
                  "Consensus Data", 
                  "Ok")
                await renderConsensusResults(stats)
              }
              setInitialized(true)
            } else {
              setInitialized(true)
            }
  
            const chartData = {
              labels: stats.map(a => a.time),
              datasets: [
                {
                  data: stats.map(a => a.eventsCount),
                  backgroundColor: 'cyan',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                  barPercentage: 0.2,
                },
              ],
            }
      
            setChartData(chartData)
            setChartChanged(false)
            console.log("scores have been updated")
          }
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
    if (props.user.isSigned) {
      authProvider.logout()
      props.user.isSigned = false
    } else {
      authProvider.login()
      props.authenticate()
    }
  }

  const handleSelectionChangedEvent = async (agentKeys: string[]):  Promise<void>  => {
    setGoldenCircle({id: uuid(), updatedOn: "", gameId: selectedGame?.id as string, agentIds: agentKeys})
    setChartChanged(true)
  }

  const chartOptions = {
    maintainAspectRatio: false,
    legend: { display: false },
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }],
    },
    title: {
      display: true,
      text: "IRR Consensus",
    },
  }

  const handleAddEvent = (e: React.FormEvent, formData: IEvent): void => {
    e.preventDefault()
    const _form: any = e.currentTarget
    formData = {...formData, advTeam: _form.elements[1].value, eventType: _form.elements[2].value, position: formData.position ?? 0, significance: formData.significance ?? 0}
    setNewEvent(formData)
    setToggled(true)
  }

  const handleSaveGoldCircle = async (selection: IEventModel[]):  Promise<string>  => {
    const goldCircleSelection: IGoldCircleModel = {
      id: uuid(),
      updatedOn: '',
      gameId: (selectedGame as IGame).id,
      agentIds: selection.flatMap(s => s.account)
    }

    // Save Gold Circle selection
    return await saveGoldCircle(goldCircleSelection)
  }

  const handleSaveConsensus = async (events: IEvent[]):  Promise<string>  => {
    return await saveEvents(events, props.user.id as string, props.user.userName as string, (selectedGame as IGame).id, true)
  }

  const handleDeleteEvent = (deletedItems: IEvent[]): void => {
    const updatedItemsList = events.filter((item, index) => !deletedItems.includes(item))
    setEvents(updatedItemsList)
  }


  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="stats" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="end">
              <Text className="Header">{props.user.displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={props.user.isSigned ? 'Sign Out' : 'Sign In'} iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={onSignInOutClicked} />
            </Stack.Item>
            <Stack horizontalAlign="center">
              <Stack.Item align="auto">
                <Dropdown
                  componentRef={dropdownRef}
                  placeholder={gamesLoaded ? ( games.length > 0 ? "Select a game" : "No games found") : "please, wait..."}
                  label="Select a Game for Which You Want To See The Analysis"
                  options={gamesList}
                  required
                  styles={dropdownStyles}
                  onChange={onGameChanged}
                />
              </Stack.Item>
            </Stack>
            <Stack.Item align="auto">
              {!isChartChanged && <main className='chart'>
                  <Bar type='bar' data={chartData} options={chartOptions} />
              </main>}
            </Stack.Item>
            <Stack.Item align="stretch">
              {isInitialized && <main className='App'>
                <StatsTable 
                  goldenCircle={goldenCircle}
                  gameStats={gameEvents} 
                  saveStats={handleSaveGoldCircle}
                  selectionChanged={handleSelectionChangedEvent}
                />                  
              </main>}
            </Stack.Item>
          </Stack>
          {props.user.isMaster && 
            <Stack>
              <Stack.Item align="auto">
                <Text block className="Title" variant='xxLarge'>IRR Game Challenge Significance Scores</Text>
              </Stack.Item>
              <Stack.Item align="auto">
                <main className='App'>
                  <AddEvent saveEvent={handleAddEvent} game={selectedGame as IGame} />
                </main>
              </Stack.Item>
              <Stack.Item align="stretch">
                {!toggled && <main className='App'>
                  {isInitialized && 
                    <EventTable 
                      events={events} 
                      saveEvents={handleSaveConsensus}
                      deleteItemsEvent={handleDeleteEvent}
                    />                  
                  }
                </main>}
              </Stack.Item>
            </Stack>}
        </div>
        <footer>
          {statusMsg}
        </footer>
    </div>      
  )
}

export default Results
