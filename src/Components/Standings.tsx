/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Text, IStackTokens, Stack, ActionButton, IIconProps } from '@fluentui/react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from '../Auth/AuthProvider'
import { Bar } from '@reactchartjs/react-chart.js'
import Navigation from './Navigation'

// Global context
// import { navBarContext } from '../NavBar/NavBar.Context'
// import { useMenu } from '../NavBar/NavBar.Hook'
// import { NIL } from 'uuid';
import { getCurrentStandings } from '../API/ResultsAPI';
import { AuthProps } from '../App';

const stackTokens: IStackTokens = { childrenGap: 20 };
const signIcon: IIconProps = { iconName: 'SignIn' };

interface StandingProps extends AuthProps {
  numOfGames: number
}


const Standings: React.FC<StandingProps> = (props) => {
  const [isInitialized, setInitialized] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string>('')
  const [chartScores, setChartScores] = useState({})
  
  useEffect(() => {
    console.log("Component Did Mount")
    try {
      const getStandings = async (numOfGames: number): Promise<void> => {
        try {
          // get standing results
          const currentStandings = await getCurrentStandings(numOfGames)

          if (currentStandings) {
            const chartScores = {
              labels: currentStandings.map(a => a.displayName),
              datasets: [
                {
                  data: currentStandings.map(a => a.score),
                  backgroundColor: 'blue',
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 1,
                  barPercentage: 0.2,
                },
              ],
            }

            setChartScores(chartScores)
            setInitialized(true)
            console.log("Standings have been updated")
          }
      } catch (error) {
          if (error.response?.status !== 404)
            alert(`Failed to fetch all significances for this game. Please try again later. Error details: ${error.message}`)      
        }
      }

      getStandings(props.numOfGames)
    } catch (error) {
      setStatusMsg("Failed to retrieve the current standings")
    }
  }, [])

  // Chart Options
  const chartScoresOptions = {
    maintainAspectRatio: false,
    legend: { display: false },
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }],
    },
    title: {
      display: true,
      text: `Current Standings (${props.numOfGames} games)`,
    },
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



  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="standings" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="end">
              <Text className="Header">{props.user.displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={props.user.isSigned ? 'Sign Out' : 'Sign In'} iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={onSignInOutClicked} />
            </Stack.Item>
            {isInitialized && <Stack verticalAlign="stretch">
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

export default Standings
