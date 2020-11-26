import React from 'react'
import { Nav, initializeIcons } from '@fluentui/react'

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
            url: '/',
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
    ],
    },
  ]
  
  const Navigation = () => {
    initializeIcons();
    return (
      <Nav
        groups={links}
        selectedKey='dash'
        styles={navigationStyles}
      />
    )
  }
  
  export default Navigation