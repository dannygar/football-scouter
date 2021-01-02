import React, { useEffect, useState } from 'react'
import { initializeIcons, IStackTokens, Stack, Text, ActionButton, IIconProps } from '@fluentui/react'
import { authProvider } from '../Auth/AuthProvider'
import '../Styles/App.css'
import 'office-ui-fabric-react/dist/css/fabric.css'
import { v4 as uuid } from 'uuid'

import { getGames, addGame, saveGames } from '../API/GameAPI'
import Navigation from '../Components/Navigation'
import { IGame } from '../Models/GameModel';
import AddGame from './AddGame';
import GameTable from './GameTable';

const signIcon: IIconProps = { iconName: 'SignIn' };

// Initialize icons in case this page uses them
initializeIcons();

type GameProps = {
  userName: string
}

const Games: React.FC<GameProps> = (props) => {
  const [readOnly, ] = useState<boolean>(!(props.userName === process.env.REACT_APP_ADMIN ?? ''))
  const [games, setGames] = useState<IGame[]>([])
  const [newGame, setNewGame] = useState<IGame | null>(null)
  const [toggled, setToggled] = useState(false)
  const [signedIn, setSignedStatus] = useState(false)
  const [userName, setUserName] = useState<string | undefined>()
  const [displayName, setDisplayName] = useState<string | undefined>()

  const stackTokens: IStackTokens = { childrenGap: 20 };

  const authenticate = (): void => {
    authProvider.getAccessToken().then (() => {
      setUserName(authProvider.getAccountInfo()?.account.userName)
      setDisplayName(authProvider.getAccountInfo()?.account.name)
      setSignedStatus((userName && userName.length > 0) ? true : false)
    })
  }
  authenticate()

  const onSignInOutClicked = (): void => {
    if (signedIn) {
      authProvider.logout()
      setSignedStatus(false)
    } else {
      authProvider.login()
      authenticate()
    }
  }

  useEffect(() => {
    fetchGames().then(() => {
    })
  },[])


  useEffect(() => {
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
  }, [games, newGame, toggled])

  const fetchGames = async (): Promise<number> => {
    const retrievedGames = await getGames()
    setGames(retrievedGames)
    return games.length
  }

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
            <Text className="Header">{displayName ?? 'Anonymous'}</Text>
              <ActionButton className="button" text={signedIn ? 'Sign Out' : 'Sign In'} iconProps={signIcon} allowDisabledFocus disabled={false} checked={false} onClick={onSignInOutClicked} />
            </Stack.Item>

          {!readOnly ? (
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
                  readOnly={readOnly}
                />                  
              </main>}
            </Stack.Item>
          </Stack>
        </div>
    </div>      
  )
}

export default Games
