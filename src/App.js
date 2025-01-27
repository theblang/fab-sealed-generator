import { useState } from 'react';
import './App.css';
import HNT from './HNT';
import HVY from './HVY';
import Select from 'react-select';

const options = [
    { value: 'HNT', label: 'The Hunted', component: <HNT /> },
    { value: 'HVY', label: 'Heavy Hitters', component: <HVY /> },
];

function App() {
    const [selectedSet, setSelectedSet] = useState(options[0]);

    const handleSetChanged = value => {
        setSelectedSet(value);
    };

    return (
        <div className="App">
            <Select
                value={selectedSet}
                onChange={handleSetChanged}
                options={options}
                className="set-select-container"
            />
            <br />
            {selectedSet && selectedSet.component}
        </div>
    );
}

export default App;
