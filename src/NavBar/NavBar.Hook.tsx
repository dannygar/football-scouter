import { useCallback, useState } from 'react'
import { MENU_ITEM_DEFAULT, NavBarContext } from './NavBar.Context'

export const useMenu = (): NavBarContext => {
    const [selectedMenu, setMenu] = useState(MENU_ITEM_DEFAULT.selectedMenu)

    const setMenuKey = useCallback((currentMenu: string): void => {
        setMenu(currentMenu)
    }, [])

    return {
        selectedMenu,
        setMenuKey
    }
}