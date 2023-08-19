import {MdAdd, MdCancel} from "react-icons/md";

// Add Properties Section
export const PropertyLinkInput = ({ addLink, setLink, addLinkName, setLinkName, addZillowLink, removeAddClick }) => {
    return (
    <div className = "PropertyAddBox">
        <div>
            <input 
            className = "PropertyInput"
            placeholder="Property Description e.g. Snake House"
            value={addLinkName} 
            onChange={(e) => {
                setLinkName(e.target.value);
            }}/>
        </div>
        <div>
            <input
                className = "PropertyInput"
                placeholder="Zillow URL e.g. https://www.zillow.com/homedetails/48-Winding-Ln-Feasterville-PA-19053/9025882_zpid/"
                value={addLink}
                onChange={(e) => {
                    setLink(e.target.value);
                }}/>
        </div>
        <div>
            <MdAdd className="newPropIcon" onClick={addZillowLink} title="Add Property" />
            <MdCancel className="newPropIcon" onClick={removeAddClick} title="Cancel" />
        </div>
    </div>)

};