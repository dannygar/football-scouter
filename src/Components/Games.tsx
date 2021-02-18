/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { IStackTokens, Stack, Text, ActionButton, IIconProps } from '@fluentui/react'
import { authContext } from '../Auth/AuthProvider'
import '../Styles/App.css'
import 'office-ui-fabric-react/dist/css/fabric.css'
import { v4 as uuid } from 'uuid'

import { getGames, addGame, saveGames } from '../API/GameAPI'
import Navigation from '../Components/Navigation'
import { IGame } from '../Models/GameModel';
import AddGame from './AddGame';
import GameTable from './GameTable';

const signIcon: IIconProps = { iconName: 'SignIn' };
const stackTokens: IStackTokens = { childrenGap: 20 };

const Games: React.FC = () => {
  const [games, setGames] = useState<IGame[]>([])
  const [newGame, setNewGame] = useState<IGame | null>(null)
  const [toggled, setToggled] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string>('')

  // Get Auth Context
  const authUserContext = useContext(authContext)

  useEffect(() => {
    console.log("Did mount")
    try {
      const fetchGames = async (): Promise<void> => {
        const retrievedGames = await getGames(authUserContext.authUser.token)
        setGames(retrievedGames)
      }
      fetchGames()
    } catch (error) {
      setStatusMsg("Failed to retrieve the list of games")
    }

    const addGameHandler = async (formData: IGame): Promise<void> => {
      await addGame(formData, games)
      .then(({ data }) => {
        setGames(data)
        console.log(`added total of ${games.length} games`)
      })
      .catch((err) => console.log(err))
    }  
    if (toggled && newGame !== null) {
      addGameHandler(newGame)
      setToggled(false)
    }
  },[])

  useEffect(() => {
    console.log("Component is updated")
    const addGameHandler = async (formData: IGame): Promise<void> => {
      await addGame(formData, games)
      .then(({ data }) => {
        setGames(data)
        console.log(`added total of ${games.length} games`)
      })
      .catch((err) => console.log(err))
    }  
    if (toggled && newGame !== null) {
      console.log("Game is added")
      addGameHandler(newGame)
      setToggled(false)
    }
  })



  const handleAddGame = (e: React.FormEvent, formData: IGame): void => {
    e.preventDefault()
    const _form: any = e.currentTarget
    formData = {...formData, id: uuid(), playedOn: formData.playedOn ?? _form.elements[3].value }
    setNewGame(formData)
    setToggled(true)
  }


  const handleSaveGames = async (games: IGame[]):  Promise<string>  => {
    const result = await saveGames(games)
    return result
  }

  const handleDeleteEvent = (deletedItems: IGame[]): void => {
    const updatedItemsList = games.filter((item, index) => !deletedItems.includes(item))
    setGames(updatedItemsList)
  }

  return (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm1 ms-xl1">
            <Navigation selectedKey="games" />
          </div>
          <Stack tokens={stackTokens} verticalAlign="end">
            <Stack.Item align="end">
            <Text className="Header">{authUserContext.authUser.displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={authUserContext.authUser.isSigned ? 'Sign Out' : 'Sign In'} 
              iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={authUserContext.onSignInOutClicked} />
            </Stack.Item>

          {authUserContext.authUser.isMaster ? (
            <Stack.Item align="auto">
              <main className='App'>
                <AddGame addGame={handleAddGame} />
              </main>
            </Stack.Item>
          ) : (
            <Stack.Item />            
          )}
            <Stack.Item align="stretch">
              {!toggled && <main className='App'>
                <GameTable 
                  games={games} 
                  saveGames={handleSaveGames}
                  deleteItemsEvent={handleDeleteEvent}
                  access={authUserContext.authUser.isMaster}
                />                  
              </main>}
            </Stack.Item>
          </Stack>
        </div>
        <footer>
          <h4>{statusMsg}</h4>
        </footer>
    </div>      
  )
}

export default Games
