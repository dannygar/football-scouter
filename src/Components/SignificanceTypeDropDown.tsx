import React from 'react'
import { SignificanceType } from '../Models/SignificanceModel';
import '../Styles/App.css';

const getTypes: any = () => {
    return [
        {
            label: "Penetration",
            value: SignificanceType.Penetration
        },
        {
            label: "Possession",
            value: SignificanceType.Possession
        },
        {
            label: "Disruption",
            value: SignificanceType.Disruption
        },
        {
            label: "Error",
            value: SignificanceType.Error
        },
    ];
};

const SignificanceTypeDropDown: React.FC<any> = () => {
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


export default SignificanceTypeDropDown