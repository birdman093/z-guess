import {MdFilterAlt} from "react-icons/md";
import React, {useState} from "react";

function FilterColumn(props){
    const toggleField = () => {
        setShowField(!showField);
    }
    const [searchValue, setSearchValue] = useState();

    function handleChange() {
        filter(searchValue);
    }
    const [showField, setShowField] = useState();
    const fieldToSearch = props.fieldToSearch;
    const filter = props.filter;

    return(
        <div className={"filter-column"}>
            <MdFilterAlt onClick={() => {toggleField()
            }}/>
            {showField ? <div>
                <div>
                    <input type={"text"} value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
                    <button onClick={e => handleChange()}>Search</button>
                </div>
            </div> : <text>Filter</text>}

        </div>
    );
}

export default FilterColumn;