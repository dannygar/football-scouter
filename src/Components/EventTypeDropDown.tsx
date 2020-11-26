import React from 'react'
import { EventType } from '../Models/EventModel';
import '../Styles/App.css';

const getTypes: any = () => {
    return [
        {
            label: "Penetration",
            value: EventType.Penetration
        },
        {
            label: "Possession",
            value: EventType.Possession
        },
        {
            label: "Disruption",
            value: EventType.Disruption
        },
        {
            label: "Error",
            value: EventType.Error
        },
    ];
};

const EventTypeDropDown: React.FC<any> = () => {
    const [loading, setLoading] = React.useState(false)
    const [items, setItems] = React.useState([])
    const [value, setValue] = React.useState("Loading...");
    React.useEffect(() => {
        setItems(getTypes)
        setLoading(false)
    }, [])
  
    return (
        <select className=".Form input"
            disabled={loading}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
        >
            {items.map(({ label, value }) => (
            <option key={value} value={value}>
                {label}
            </option>
            ))}
        </select>
    );
}


export default EventTypeDropDown