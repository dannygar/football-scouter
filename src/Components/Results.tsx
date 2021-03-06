/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { Dropdown, Text, IDropdown, IStackTokens, Stack, IDropdownOption, ActionButton, IIconProps, Spinner } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authContext, authProvider } from '../Auth/AuthProvider'
import { Bar } from '@reactchartjs/react-chart.js'

import Navigation from './Navigation'
import { IGame } from '../Models/GameModel'

// Global context
// import { navBarContext } from '../NavBar/NavBar.Context'
// import { useMenu } from '../NavBar/NavBar.Hook'
// import { NIL } from 'uuid';
import { getGames } from '../API/GameAPI';
import { getGameResults } from '../API/ResultsAPI';
import { AuthProps } from '../App';

const dropdownStyles = { dropdown: { width: 500 }, label: { color: 'Blue' } };
const stackTokens: IStackTokens = { childrenGap: 20 };
const signIcon: IIconProps = { iconName: 'SignIn' };

// Chart Options
const chartHitsOptions = {
  maintainAspectRatio: false,
  legend: { display: false },
  scales: {
    yAxes: [{ ticks: { beginAtZero: true } }],
  },
  title: {
    display: true,
    text: "Hits",
  },
}
const chartMavericksOptions = {
  maintainAspectRatio: false,
  legend: { display: false },
  scales: {
    yAxes: [{ ticks: { beginAtZero: true } }],
  },
  title: {
    display: true,
    text: "Mavericks",
  },
}
const chartScoresOptions = {
  maintainAspectRatio: false,
  legend: { display: false },
  scales: {
    yAxes: [{ ticks: { beginAtZero: true } }],
  },
  title: {
    display: true,
    text: "Scores",
  },
}


const Results: React.FC = () => {
  const [games, setGames] = useState<IGame[]>([])
  const [gamesList, setGamesList] = useState<IDropdownOption[]>([])
  const [gamesLoaded, setGamesLoaded] = useState(false)
  const [isInitialized, setInitialized] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string>('')
  const [chartHits, setChartHits] = useState({})
  const [chartMavericks, setChartMavericks] = useState({})
  const [chartScores, setChartScores] = useState({})
  
  // Get Auth Context
  const authUserContext = useContext(authContext)

  const dropdownRef = React.createRef<IDropdown>()

  useEffect(() => {
    console.log("Component Did Mount")
    try {
      const fetchGames = async (): Promise<boolean> => {
        const retrievedGames = await getGames(authUserContext.authUser.token)
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
    } catch (error) {
      setStatusMsg("Failed to retrieve the list of games")
    }
  }, [])


  const onGameChanged = async (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption, index?: number): Promise<void> => {
    if (item && item.data) {
      const getResults = async (gameId: string): Promise<void> => {
        try {
          // get game's results
          const gameResults = await getGameResults(gameId, authUserContext.authUser.token)

          if (gameResults) {
            const chartHits = {
              labels: gameResults.map(a => a.displayName),
              datasets: [
                {
                  data: gameResults.map(a => a.hits),
                  backgroundColor: 'blue',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                  barPercentage: 0.2,
                },
              ],
            }
            const chartMavericks = {
              labels: gameResults.map(a => a.displayName),
              datasets: [
                {
                  data: gameResults.map(a => a.maverics),
                  backgroundColor: 'purple',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                  barPercentage: 0.2,
                },
              ],
            }
            const chartScores = {
              labels: gameResults.map(a => a.displayName),
              datasets: [
                {
                  data: gameResults.map(a => a.score),
                  backgroundColor: 'green',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                  barPercentage: 0.2,
                },
              ],
            }

            setChartHits(chartHits)
            setChartMavericks(chartMavericks)
            setChartScores(chartScores)
            setInitialized(true)
            console.log("Results have been updated")
          }
      } catch (error) {
          if (error.response?.status !== 404)
            alert(`Failed to fetch all significances for this game. Please try again later. Error details: ${error.message}`)      
        }
      }

      await getResults(item.data?.id)
    }
  }

  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="results" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="end">
              <Text className="Header">{authUserContext.authUser.displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={authUserContext.authUser.isSigned ? 'Sign Out' : 'Sign In'} 
              iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={authUserContext.onSignInOutClicked} />
            </Stack.Item>
            <Stack horizontalAlign="center">
              <Stack.Item align="auto">
                <Dropdown
                  componentRef={dropdownRef}
                  placeholder={gamesLoaded ? ( games.length > 0 ? "Select a game" : "No games found") : "please, wait..."}
                  label="Select a Game for Which You Want To See The Results"
                  options={gamesList}
                  required
                  styles={dropdownStyles}
                  onChange={onGameChanged}
                />
              </Stack.Item>
            </Stack>
            {gamesLoaded && !isInitialized && <Spinner label="Please, wait. Loading..." />}
            {isInitialized && <Stack verticalAlign="stretch">
              <Stack.Item align="auto">
                <main className='chart'>
                    <Bar type='bar' data={chartHits} options={chartHitsOptions} />
                </main>
              </Stack.Item>
              <Stack.Item align="auto">
                <main className='chart'>
                    <Bar type='bar' data={chartMavericks} options={chartMavericksOptions} />
                </main>
              </Stack.Item>
              <Stack.Item align="auto">
                <main className='chart'>
                    <Bar type='bar' data={chartScores} options={chartScoresOptions} />
                </main>
              </Stack.Item>
            </Stack>}
          </Stack>
        </div>
        <footer>
          {statusMsg}
        </footer>
    </div>      
  )
}

export default Results
