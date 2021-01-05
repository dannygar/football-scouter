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
import { IEvent } from '../Models/EventModel'
import { getEventType } from '../Utils/TypeConversion';

type EventItemProps = {
  saveEvents: (games: IEvent[]) => Promise<string>
  deleteItemsEvent: (deletedItems: IEvent[]) => void
  events: IEvent[]
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


const commandBarStyles: Partial<ICommandBarStyles> = { root: { marginBottom: '40px' } };

const EventTable: React.FC<EventItemProps> = (props) => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [items, setItems] = useState<IEvent[]>([])
    const [selectedItems, setSelectedItems] = useState<IEvent[]>([])
    const [toggleDelete, setToggleDelete] = useState(false)
    const [stateMessage, setStateMessage] = useState<string>('')

    function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
      const key = columnKey as keyof T;
      return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }

    useEffect(() => {
      if ((props.events && props.events.length > 0) || props.events.length !== items.length) {
        setItems(props.events)
     }
    },[props.events, items.length])

    useEffect(() => {
      const onTimeColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        if (columns.length > 0) {
          const newColumns: IColumn[] = columns.slice()
          const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0]
          newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
              currColumn.isSorted = true
            } else {
              newCol.isSorted = false
              newCol.isSortedDescending = true
            }
          })
          const newItems = _copyAndSort(items, currColumn.fieldName!, false)
          
          setItems(newItems)
        }
      }
    
      const columns = [
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
          onRender: (item: IEvent) => {
              return <FontIcon iconName="Soccer" className={classNames.iconImg} />
          },
        },
        {
          key: 'column2',
          name: 'Event Time',
          fieldName: 'eventTime',
          minWidth: 70,
          maxWidth: 90,
          isRowHeader: true,
          isResizable: true,
          isSorted: true,
          isSortedDescending: true,
          sortAscendingAriaLabel: 'Sorted Small to Large',
          sortDescendingAriaLabel: 'Sorted Large to Small',
          onColumnClick: onTimeColumnClick,
          data: 'number',
          isPadded: true
        },
        {
          key: 'column3',
          name: 'Advantaged Team',
          fieldName: 'advTeam',
          minWidth: 100,
          maxWidth: 120,
          isResizable: true,
          data: 'string',
          onRender: (item: IEvent) => {
              return <span>{item.advTeam}</span>
          },
          isPadded: true,
        },
        {
          key: 'column4',
          name: 'Event Type',
          fieldName: 'eventType',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
          onRender: (item: IEvent) => {
              return <span>{getEventType(item.eventType)}</span>;
          },
          isPadded: true,
        },
        {
          key: 'column5',
          name: 'Position',
          fieldName: 'position',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          isCollapsible: true,
          data: 'number',
        },
        {
          key: 'column6',
          name: 'Significance',
          fieldName: 'significance',
          minWidth: 90,
          maxWidth: 120,
          isResizable: true,
          isCollapsible: true,
          data: 'number',
        },
        {
          key: 'column7',
          name: 'Credit',
          fieldName: 'credit',
          minWidth: 90,
          maxWidth: 120,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
        },
        {
          key: 'column8',
          name: 'Blame',
          fieldName: 'blame',
          minWidth: 120,
          maxWidth: 150,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
        },
        {
          key: 'column9',
          name: 'Comments',
          fieldName: 'comments',
          minWidth: 250,
          maxWidth: 350,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
        },
      ]

      setColumns(columns)

    }, [items])

    const onItemsSelectionChanged  = () => {
      const selectedItems = selection.getSelection()
      setSelectedItems(selectedItems as IEvent[])
    }

    const [selection, ] = useState<Selection>(new Selection({
      onSelectionChanged: onItemsSelectionChanged,
    }))


    useEffect(() => {
      const deleteRowEventHandler = (updatedItems: IEvent[]): void => {
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
      } 
    }, [props, props.events, items, selection, selectedItems, toggleDelete])
  
    const getKey = (item: IEvent, index?: number): string => {
        return item.id;
    }

    const onItemInvoked = (item: IEvent): void => {
        console.log(`Item invoked: ${item.id}`);
    }

    const onRenderRow = (props: IDetailsRowProps | undefined): JSX.Element => {
      // sort all times
      _copyAndSort(items, "eventTime", false)
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
          onClick: onSaveEvents,
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
  
    const onSaveEvents = async (): Promise<void> => {
      const response = await props.saveEvents(items)
      setStateMessage(response)
    }


  

    return (
      <div data-is-scrollable={true}>
        <Fabric className="Table">
          <CommandBar
            styles={commandBarStyles}
            items={getCommandItems()}
            farItems={[{ key: 'state', text: `${stateMessage ?? ''}` }]}
          />

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

export default EventTable