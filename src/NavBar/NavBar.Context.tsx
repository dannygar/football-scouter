import React from 'react'

// Create the global Context
export interface NavBarContext {
    selectedMenu: string
    setMenuKey: (currentKey: string) => void
}

export const MENU_ITEM_DEFAULT = {
    selectedMenu: 'dash',
    setMenuKey: () => {}
}

export const navBarContext = React.createContext<NavBarContext>(MENU_ITEM_DEFAULT)
