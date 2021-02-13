import React, { useState } from 'react'
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

// Initialize icons in case this page uses them
initializeIcons();

const App: React.FC = () => {
  const currentMenu = useMenu()
  const [token, setToken] = useState<string>('')
  authProvider.getAccessToken().then ((value: AccessTokenResponse) => {
    setToken(value.accessToken)
  })
  const userName = authProvider.getAccountInfo()?.account.userName


  return (
    <div className="ms-Grid" dir="ltr">
      <navBarContext.Provider value={currentMenu}>
        <Router>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/stats" children={<Stats userName={userName as string} />} />
              <Route path="/results" children={<Results userName={userName as string} />} />
              <Route path="/games" children={<Games userName={userName as string} />} />
              <Redirect from="*" to="/dashboard" />
            </Switch>
        </Router>
      </navBarContext.Provider>
    </div>
  )
}

export default App
