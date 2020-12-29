import React from 'react'
import '../Styles/App.css';


type DropDownProps = { 
    items: any[]
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
    type: string
    id: string
}

const EventTypeDropDown: React.FC<DropDownProps> = (props: DropDownProps) => {
    const [loading, setLoading] = React.useState(false)
    const [items, setItems ] = React.useState(props.items)
    const [value, setValue] = React.useState("Loading...");
    React.useEffect(() => {
        setItems(props.items)
        setLoading(false)
    }, [props.items, items])
  
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