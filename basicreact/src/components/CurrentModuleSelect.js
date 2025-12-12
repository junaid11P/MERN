import React, { useState } from 'react';

function CurrentModuleSelect() {
    const [currentModule, setCurrentModule] = useState('Module1');

    const handlechange = (e) => {
        setCurrentModule(e.target.value);
        console.log("selected module:", e.target.value);
    };
    return (
        <div className="current-module-select" style={{position: "abolute", top:"10px", left:"10px"}}>
            <label htmlFor="module" style={{marginRight: "8px"}}>
                Current Module:
            </label>
            <select
                id="module"
                value={currentModule}
                onChange={handlechange}
                style={{
                    padding: "6px 10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                }}
            >
                <option value="Module1">Python Basics</option>
                <option value="Module2">Data Structures</option>
                <option value="Module3">Algorithms</option>
                <option value="Module4">Web Development</option>
            </select>
        </div>
    );
}
export default CurrentModuleSelect;