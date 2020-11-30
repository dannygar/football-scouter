import React, { useContext, useEffect, useState } from 'react'
import { Nav, initializeIcons, INavLink } from '@fluentui/react'
import GameManager from './GameManager'
import { IEvent } from '../Models/EventModel'

// Global NavBar context
import { NavBarContext, navBarContext } from '../NavBar/NavBar.Context'
import { useMenu } from '../NavBar/NavBar.Hook'

const navigationStyles = {
    root: {
      height: '100vh',
      boxSizing: 'border-box',
      border: '1px solid #eee',
      overflowY: 'auto',
      paddingTop: '10vh',
    },
  }
  
const links = [
    {
      links: [
        {
            name: 'Dashboard',
            key:'dash',
            url: '/dashboard',
            iconProps: {
                iconName: 'News',
                styles: {
                    root: {
                        fontSize: 20,
                        color: '#106ebe',
                    },
                }
            }
        },
        {
            name: 'Stats',
            key: 'stats',
            url: '/',
            iconProps: {
                iconName: 'PowerBILogo',
                styles: {
                    root: {
                        fontSize: 20,
                        color: '#106ebe',
                    },
                }
            }
        },
        {
            name: 'Standing',
            key: 'stand',
            url: '/',
            iconProps: {
                iconName: 'PeopleAlert',
                styles: {
                    root: {
                        fontSize: 20,
                        color: '#106ebe',
                    },
                }
            }
        },
        {
            name: 'Rules',
            key: 'rules',
            url: '/',
            iconProps: {
                iconName: 'Settings',
                styles: {
                    root: {
                        fontSize: 20,
                        color: '#106ebe',
                    },
                }
            }
        },
        {
            name: 'Games',
            key: 'games',
            url: '/games',
            iconProps: {
                iconName: 'Soccer',
                styles: {
                    root: {
                        fontSize: 20,
                        color: '#106ebe',
                    },
                }
            }
        },
    ],
    },
]

type NavProps = {
    selectedKey: string
}
  
const Navigation: React.FC<NavProps> = (props) => {
    // Set selected Menu
    const { setMenuKey } = useContext(navBarContext)
    const [menuKey, setCurrentMenuKey] = useState<string>(useMenu().selectedMenu)

    initializeIcons();

    const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
        if (item && item.key) {
            setMenuKey(item.key)
            setCurrentMenuKey(item.Key)
            console.log(`menu key=${item.key}`)
        }
    }

    // useEffect(() => {
    //     setCurrentMenuKey(props.selectedKey)
    // },[])


    return (
        <Nav
            onLinkClick={onLinkClick}
            groups={links}
            selectedKey={props.selectedKey}
            styles={navigationStyles}
        />
    )
}

  
export default Navigation