import React, { useEffect, useState } from 'react'
import { mergeStyleSets } from '@fluentui/react'
import 'office-ui-fabric-react/dist/css/fabric.css'
import {
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn,
    FontIcon,
    Fabric,
  } from '@fluentui/react';
import { IEvent } from '../Models/EventModel'
import { getEventType } from '../Utils/TypeConversion';


type EventItemProps = {
    updateEvent: (event: IEvent) => void
    deleteEvent: (_id: string) => void
    events: IEvent[]
}

// type EventItemProps = EventProps & {
//     updateEvent: (event: IEvent) => void
//     deleteEvent: (_id: string) => void
//     rows: IEvent[]
// }



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
    onRender: (item: IEvent) => {
        return <FontIcon iconName="Soccer" className={classNames.iconImg} />
    },
  },
  {
    key: 'column2',
    name: 'Event Time',
    fieldName: 'time',
    minWidth: 70,
    maxWidth: 90,
    isRowHeader: true,
    isResizable: true,
    isSorted: false,
    isSortedDescending: false,
    data: 'string',
    isPadded: true,
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
        return <span>{item.advTeam}</span>;
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
];


const EventTable: React.FC<EventItemProps> = (props) => {
    const [items, setItems] = useState(props.events)

    useEffect(() => {
        setItems(props.events)
    }, [props.events, items])

    const getKey = (item: IEvent, index?: number): string => {
        return item.id;
    }

    const onItemInvoked = (item: IEvent): void => {
        console.log(`Item invoked: ${item.id}`);
    }
    

    return (
      <div data-is-scrollable={true}>
        <Fabric className="Table">
          <DetailsList
              items={items}
              compact={false}
              columns={columns}
              selectionMode={SelectionMode.none}
              getKey={getKey}
              setKey="none"
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
              onItemInvoked={onItemInvoked}
          />
        </Fabric>
      </div>
    );
};

export default EventTable