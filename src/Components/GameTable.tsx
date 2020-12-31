import React, { useEffect, useState } from 'react'
import { mergeStyleSets } from '@fluentui/react'
import 'office-ui-fabric-react/dist/css/fabric.css'
import { getTheme } from 'office-ui-fabric-react/lib/Styling';
import {
    DetailsList,
    DetailsListLayoutMode,
    CheckboxVisibility,
    IDetailsRowProps,
    DetailsRow,
    IDetailsRowStyles,
    SelectionMode,
    IColumn,
    FontIcon,
    CommandBar,
    IContextualMenuItem,
    ICommandBarStyles,
    Selection,
    Fabric,
  } from '@fluentui/react';
import { IGame } from '../Models/GameModel'

type GameItemProps = {
    saveGames: (games: IGame[]) => Promise<string>
    deleteItemsEvent: (deletedItems: IGame[]) => void
    games: IGame[]
    readOnly: boolean
}

const theme = getTheme();

const classNames = mergeStyleSets({
  iconHeader: {
    padding: 0,
    fontSize: '16px',
  },
  iconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden',
      },
    },
  },
  iconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px',
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  exampleToggle: {
    display: 'inline-block',
    marginBottom: '10px',
    marginRight: '30px',
  },
  selectionDetails: {
    marginBottom: '20px',
  },
});

const columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Row Type',
    className: classNames.iconCell,
    iconClassName: classNames.iconHeader,
    ariaLabel: '',
    iconName: 'Soccer',
    isIconOnly: true,
    fieldName: 'icon',
    minWidth: 16,
    maxWidth: 16,
    onRender: (item: IGame) => {
        return <FontIcon iconName="Soccer" className={classNames.iconImg} />
    },
  },
  {
    key: 'column2',
    name: 'Home Team',
    fieldName: 'homeTeam',
    minWidth: 100,
    maxWidth: 120,
    isRowHeader: true,
    isResizable: true,
    isSorted: false,
    isSortedDescending: false,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column3',
    name: 'Away Team',
    fieldName: 'awayTeam',
    minWidth: 100,
    maxWidth: 120,
    isResizable: true,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column4',
    name: 'Played On',
    fieldName: 'playedOn',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column5',
    name: 'League',
    fieldName: 'league',
    minWidth: 100,
    maxWidth: 120,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    isPadded: true,
  },
  {
    key: 'column6',
    name: 'Is Full Game',
    fieldName: 'fullGame',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'boolean',
  },
];

const commandBarStyles: Partial<ICommandBarStyles> = { root: { marginBottom: '40px' } };

const GameTable: React.FC<GameItemProps> = (props) => {
    const [items, setItems] = useState<IGame[]>(props.games)
    const [selectedItems, setSelectedItems] = useState<IGame[]>([])
    const [toggleDelete, setToggleDelete] = useState(false)
    const [stateMessage, setStateMessage] = useState<string | undefined>()

    const onItemsSelectionChanged  = () => {
      const selectedItems = selection.getSelection()
      setSelectedItems(selectedItems as IGame[])
    }

    const [selection, ] = useState<Selection>(new Selection({
      onSelectionChanged: onItemsSelectionChanged,
    }))


    useEffect(() => {
      const deleteRowEventHandler = (updatedItems: IGame[]): void => {
        setItems(updatedItems)
        props.deleteItemsEvent(selectedItems)
      }  
      
      const resetSelection = () => {
        selection.setAllSelected(false)
      }
      
      if (toggleDelete && selectedItems.length > 0) {
        const updatedItemsList = items.filter((item, index) => !selectedItems.includes(item))
        deleteRowEventHandler(updatedItemsList)
        setToggleDelete(false)
        resetSelection()
      } else {
        if (selectedItems.length === 0) {
          setItems(props.games)
        }
      }
    }, [props, props.games, items, selection, selectedItems, toggleDelete])
  
    const getKey = (item: IGame, index?: number): string => {
        return item.id;
    }

    const onItemInvoked = (item: IGame): void => {
        console.log(`Item invoked: ${item.id}`);
    }

    const onRenderRow = (props: IDetailsRowProps | undefined): JSX.Element => {
      // Set each other row's background a bit lighter
      const customStyles: Partial<IDetailsRowStyles> = {}
      if (props) {
        if (props.itemIndex % 2 === 0) {
          // Every other row renders with a different background color
          customStyles.root = { backgroundColor: theme.palette.themeLighterAlt }
        }
  
        return <DetailsRow {...props} styles={customStyles} />
      }
      return <div />
    }
    
    const getCommandItems = (): IContextualMenuItem[] => {
      return [
        {
          key: 'deleteRow',
          text: 'Delete row',
          iconProps: { iconName: 'Delete' },
          onClick: onDeleteRow,
        },
        {
          key: 'saveRow',
          text: 'Save Results',
          iconProps: { iconName: 'Save' },
          onClick: onSaveGames,
        },
      ]
    }

    const onDeleteRow = (): void => {
      if (selection.getSelectedCount() > 0) {
        setToggleDelete(true)
        setStateMessage(`${selection.getSelectedCount()} item(s) were successfully deleted`)
      } else {
        alert('Please select at least one row to be deleted.')
      }
    }
  
    const onSaveGames = async (): Promise<void> => {
      const response = await props.saveGames(items)
      setStateMessage(response)
    }
    

    return (
      <div data-is-scrollable={true}>
        <Fabric className="Table">
          {!props.readOnly ? (
            <CommandBar
              styles={commandBarStyles}
              items={getCommandItems()}
              farItems={[{ key: 'state', text: `${stateMessage ?? ''}` }]}
            />
          ) : (
            <br/>
          )}

          <DetailsList
              items={items}
              compact={false}
              columns={columns}
              selectionMode={SelectionMode.multiple}
              selection={selection}
              getKey={getKey}
              setKey="none"
              layoutMode={DetailsListLayoutMode.justified}
              checkboxVisibility={CheckboxVisibility.onHover}
              isHeaderVisible={true}
              enterModalSelectionOnTouch={true}
              onItemInvoked={onItemInvoked}
              onRenderRow={onRenderRow}
          />
        </Fabric>
      </div>
    );
};

export default GameTable