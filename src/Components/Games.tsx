import React, { useContext, useEffect, useState } from 'react'
import '../Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { authProvider } from '../Auth/AuthProvider'
import { getEvents, saveEvents, updateEvent, deleteEvent } from '../API/APIs'
import { IEvent } from '../Models/EventModel'
import AddEvent from './AddEvent'
import Navigation from './Navigation'
import { AccessTokenResponse } from 'react-aad-msal';

// Global context
import { navBarContext } from '../NavBar/NavBar.Context'
import { useMenu } from '../NavBar/NavBar.Hook'

const App: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([])
  
  const [token, setToken] = useState<string>('')

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
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="games" />
          </div>
          <div className="main-element ms-Grid-col ms-sm11 ms-xl11">
            <div className="ms-Grid-row">
              <main className='App'>
              </main>
            </div>
            <div className="ms-Grid-row">
              <main className='App'>
              </main>
            </div>
          </div>
        </div>
    </div>      
  )
}

export default App
