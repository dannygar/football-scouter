import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import './Styles/App.css';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { IEvent } from './Models/EventModel'

// Global context
import { navBarContext } from './NavBar/NavBar.Context'
import { useMenu } from './NavBar/NavBar.Hook'
import Dashboard from './Components/Dashboard';
import Games from './Components/Games';
import Card from './Components/Card';

const App: React.FC = () => {
  const currentMenu = useMenu();

  return (
    <div className="ms-Grid" dir="ltr">
      <navBarContext.Provider value={currentMenu}>
        <Router>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/stats" children={<Card title="something" body="very very interesting" />} />
              <Route path="/games" component={Games} />
              <Redirect from="*" to="/dashboard" />
            </Switch>
        </Router>
      </navBarContext.Provider>
    </div>
  )
}

export default App
