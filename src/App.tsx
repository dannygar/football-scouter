import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import './Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from './Auth/AuthProvider'
import { getEvents } from './API/APIs'
import { IEvent } from './Models/EventModel'
import { AccessTokenResponse } from 'react-aad-msal';

// Global context
import { navBarContext } from './NavBar/NavBar.Context'
import { useMenu } from './NavBar/NavBar.Hook'
import Dashboard from './Components/Dashboard';
import Games from './Components/Games';

const App: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([])
  
  const [token, setToken] = useState<string>('')

  const currentMenu = useMenu();

  useEffect(() => {
    fetchEvents()
    authProvider.getAccessToken().then ((value: AccessTokenResponse) => {
      setToken(value.accessToken)
    })
  }, [token])

  const fetchEvents = (): void => {
    getEvents()
    .then(({ data: { events } }: IEvent[] | any) => setEvents(events))
    .catch((err: Error) => console.log(err))
  }

  return (
    <div className="ms-Grid" dir="ltr">
      <navBarContext.Provider value={currentMenu}>
        <Router>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/games" component={Games} />
              <Redirect from="*" to="/dashboard" />
            </Switch>
        </Router>
      </navBarContext.Provider>
    </div>
  )
}

export default App
