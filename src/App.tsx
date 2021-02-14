import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react';
import './Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from './Auth/AuthProvider'
import { AccessTokenResponse } from 'react-aad-msal'

// Global context
import { navBarContext } from './NavBar/NavBar.Context'
import { useMenu } from './NavBar/NavBar.Hook'
import Dashboard from './Components/Dashboard';
import Games from './Components/Games';
import Stats from './Components/Stats';
import Results from './Components/Results';
import { isMaster } from './API/MasterAPI';
import { Agent } from './Models/Agent';

// Initialize icons in case this page uses them
initializeIcons();

const App: React.FC = () => {
  const currentMenu = useMenu()
  const [isInitialized, setInitialized] = useState(false)
  const [user, setUser] = useState<Agent | null>(null)

  // Authenticate user
  const authenticate = async (): Promise<void> => {
    const accessTokenResponse = await authProvider.getAccessToken()
    const userInfo = authProvider.getAccountInfo()
    if (userInfo !== null) {
      setUser({
        id: userInfo.account.accountIdentifier as string,
        userName: userInfo.account.userName,
        displayName: userInfo.account.name,
        token: accessTokenResponse.accessToken,
        isMaster: await isMaster(userInfo.account.accountIdentifier as string),
        isSigned: (userInfo.account.userName && userInfo.account.userName.length > 0) ? true : false
      })
      setInitialized(true)
    }
  }
  
  useEffect(() => {
    console.log("Component Did Mount")
    try {
      authenticate()
    } catch (error) {
      alert("Failed to authenticate the current user")
    }
  }, [isInitialized])


  return (
    <div className="ms-Grid" dir="ltr">
      {isInitialized && 
      <navBarContext.Provider value={currentMenu}>
        <Router>
            <Switch>
              <Route path="/dashboard" children={<Dashboard user={user as Agent} authenticate={authenticate} />} />
              <Route path="/stats" children={<Stats user={user as Agent}  authenticate={authenticate} />} />
              <Route path="/results" children={<Results user={user as Agent}  authenticate={authenticate} />} />
              <Route path="/games" children={<Games user={user as Agent}  authenticate={authenticate} />} />
              <Redirect from="*" to="/dashboard" />
            </Switch>
        </Router>
      </navBarContext.Provider>
      }
    </div>
  )
}

export default App
