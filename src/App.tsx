import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react';
import './Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider, authContext } from './Auth/AuthProvider'

// Global context
import { navBarContext } from './NavBar/NavBar.Context'
import { useMenu } from './NavBar/NavBar.Hook'
import Dashboard from './Components/Dashboard';
import Games from './Components/Games';
import Stats from './Components/Stats';
import Results from './Components/Results';
import { isMaster } from './API/MasterAPI';
import { Agent } from './Models/Agent';
import Standings from './Components/Standings';
import Rules from './Components/Rules';

// Initialize icons in case this page uses them
initializeIcons();

export type AuthProps = {
  user: Agent
  authenticate: () => Promise<void>
}

const App: React.FC = () => {
  const currentMenu = useMenu()
  const [isInitialized, setInitialized] = useState(false)
  const [user, setUser] = useState<Agent | null>(null)
  const [numOfGames, setNumOfGames] = useState<number>(0)

  // Set Auth Context
  const authContextProvider = useContext(authContext)

  // Authenticate user
  const authenticate = async (): Promise<void> => {
    try {
      const accessTokenResponse = await authProvider.getAccessToken()
      const userInfo = authProvider.getAccountInfo()
      if (userInfo !== null) {
        // Set Auth User
        authContextProvider.authUser = {
          id: userInfo.account.accountIdentifier as string,
          userName: userInfo.account.userName,
          displayName: userInfo.account.name,
          token: accessTokenResponse.accessToken,
          isMaster: await isMaster(userInfo.account.accountIdentifier as string, accessTokenResponse.accessToken),
          isSigned: (userInfo.account.userName && userInfo.account.userName.length > 0) ? true : false,
        }

        //setUser(authUser)
        setInitialized(true)
      }
    } catch (error) {
      try {
        if (error.response.status === 401) {
          alert('Access is denied. Please check with your admin and try again.')
        } else {
          alert (`Failed to authenticate. Error: ${error.message}`)      
        }
      } catch (error) {
        alert (`Failed to authenticate. Check that API is up and running and try again.`)      
      }
      authProvider.logout()
    }
  }
  
  useEffect(() => {
    console.log("Component Did Mount")
    try {
      authenticate()
      const numOfGames = Number.parseInt(process.env.REACT_APP_STANDINGS_GAMES as string)
      setNumOfGames(Number.isInteger(numOfGames) ? numOfGames : 0)
    } catch (error) {
      alert("Failed to authenticate the current user")
    }
  }, [isInitialized])

  authContextProvider.onSignInOutClicked = (): void => {
    if (authContextProvider.authUser.isSigned) {
      authProvider.logout()
      authContextProvider.authUser.isSigned = false
    } else {
      authProvider.login()
      authenticate()
    }
  }  

  return (
    <div className="ms-Grid" dir="ltr">
      {isInitialized && 
      <navBarContext.Provider value={currentMenu}>
        <authContext.Provider value={authContextProvider}>
          <Router>
              <Switch>
                <Route path="/dashboard" children={<Dashboard />} />
                {/* <Route path="/dashboard" children={<Dashboard user={user as Agent} authenticate={authenticate} />} /> */}
                <Route path="/stats" children={<Stats />} />
                <Route path="/results" children={<Results />} />
                <Route path="/standings" children={<Standings numOfGames={numOfGames} />} />
                <Route path="/rules" children={<Rules />} />
                <Route path="/games" children={<Games />} />
                <Redirect from="*" to="/dashboard" />
              </Switch>
          </Router>
        </authContext.Provider>
      </navBarContext.Provider>
      }
    </div>
  )
}

export default App
