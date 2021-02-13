import React, { useEffect, useState } from 'react'
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
    CommandBar,
    IContextualMenuItem,
    ICommandBarStyles,
    Selection,
    Fabric,
  } from '@fluentui/react';
import { IEventModel } from '../Models/EventModel';
import IGoldCircleModel from '../Models/GoldCircleModel';

type ScoreItemProps = {
  selectionChanged: (scores: string[]) => Promise<void>
  saveStats: (scores: IEventModel[]) => Promise<string>
  goldenCircle: IGoldCircleModel | null
  gameStats: IEventModel[]
}

const theme = getTheme();

const commandBarStyles: Partial<ICommandBarStyles> = { root: { marginBottom: '40px' } };

const StatsTable: React.FC<ScoreItemProps> = (props) => {
    const [columns, setColumns] = useState<IColumn[]>([])
    const [items, setItems] = useState<IEventModel[]>([])
    const [selectedItems, setSelectedItems] = useState<IEventModel[]>([])
    const [stateMessage, setStateMessage] = useState<string>('')
    const [scouters, setScouters] = useState<string[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
      if ((props.gameStats && props.gameStats.length > 0) || props.gameStats.length !== items.length) {
        setItems(props.gameStats)
        const scouters = items.map(i => i.email.split('@')[0])
        setScouters(scouters)
        setLoaded(true)
     }
    },[props.gameStats, items, props.goldenCircle])

    useEffect(() => {
      if (loaded) {
        const events = items.flatMap(i => i.events).sort((a,b) => a.eventTime - b.eventTime)
        const uniqueEvents = [...new Set(events.map(e => e.eventTime))]
        let columns: IColumn[] = []
        columns.push({
          key: 'name',
          name: 'Name',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          data: 'string',
          isPadded: true,
        },)
        uniqueEvents.forEach((event, i) => {
          columns.push({
            key: i.toString(),
            name: event.toString(),
            minWidth: 20,
            maxWidth: 30,
            isRowHeader: true,
            isResizable: true,
            data: 'number',
            isPadded: true
          })
        });
        setColumns(columns)

        // select only golden circle agents, if provided
        if (props.goldenCircle && props.goldenCircle.agentIds.length > 0) {
          selection.setAllSelected(false)
          const selectedIndexes: number[] = []
          const _items: IEventModel[] = selection.getItems() as IEventModel[]
          _items.forEach((item, index) => {
            const isSelected = props.goldenCircle?.agentIds.filter(id => id === item.account)
            if (isSelected && isSelected?.length > 0) {
              selectedIndexes.push(index)
            }
          })

          selectedIndexes.forEach(index => {
            selection.setIndexSelected(index, true, false)
          })
        }
        else {
          selection.setAllSelected(true)
        }
      }

    }, [items])

    const onItemsSelectionChanged  = () => {
      const selectedItems = selection.getSelection()
      setSelectedItems(selectedItems as IEventModel[])

      console.log(getSelectionDetails())
    }

    const [selection, setSelection ] = useState<Selection>(new Selection({
      onSelectionChanged: onItemsSelectionChanged,
    }))


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

    const onRenderItemColumn = (item?: IEventModel | any, index?: number | undefined, column?: IColumn | undefined): JSX.Element => {
      const tableColumn = column as IColumn
      const gameEvent = item as IEventModel

      switch (tableColumn.key) {
        case 'name':
          return <h2>{scouters[index as number]}</h2>
        default:
          const fieldContent = gameEvent.events.filter(e => e.eventTime === Number.parseFloat(tableColumn.name))
          return <span>{fieldContent.length > 0 ? 'X' : ''}</span>
      }    
    }
    
    const getCommandItems = (): IContextualMenuItem[] => {
      return [
        {
          key: 'recalculate',
          text: 'Recalculate Consensus',
          iconProps: { iconName: 'Refresh' },
          onClick: onRecalculate,
        },
        {
          key: 'saveRow',
          text: 'Save Golden Circle',
          iconProps: { iconName: 'Save' },
          onClick: onSaveEvents,
        },
      ]
    }

    const onRecalculate = (): boolean | void => {
      if (selection.getSelectedCount() > 0) {
        const selectedItems = (selection.getSelection() as IEventModel[]).flatMap(s => s.account)
        props.selectionChanged(selectedItems).then (() => {
          setStateMessage(`${selection.getSelectedCount()} item(s) were recalculated`)
        })
      } else {
        alert('Please select at least one row to be calculated.')
      }
    }
  
    const onSaveEvents = (): boolean | void => {
      props.saveStats(selectedItems).then (response => {
        setStateMessage(response)
      })
    }

    const getSelectionDetails = (): string => {
      const selectionCount = selection.getSelectedCount();
  
      switch (selectionCount) {
        case 0:
          return 'No items selected';
        case 1:
          return '1 item selected: ' + (selection.getSelection()[0] as IEventModel).id;
        default:
          return `${selectionCount} items selected`;
      }
    }


    const getKey = (item: any, index?: number | undefined): string => {
      return item.account
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
              selectionPreservedOnEmptyClick={true}
              setKey="multiple"
              getKey={getKey}
              layoutMode={DetailsListLayoutMode.justified}
              checkboxVisibility={CheckboxVisibility.onHover}
              isHeaderVisible={true}
              enterModalSelectionOnTouch={true}
              onRenderRow={onRenderRow}
              onRenderItemColumn={onRenderItemColumn}
          />
        </Fabric>
      </div>
    );
};

export default StatsTable