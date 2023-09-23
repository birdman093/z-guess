import {MdAdd, MdCancel} from "react-icons/md/index.esm.js";

// Add Properties Section
export const PropertyLinkInput = ({ inputFields, addLink, setLink, addLinkName, setLinkName, addZillowLink, removeAddClick }) => {
    if (inputFields) {    
        return (
            <div className = "PropertyAddBox">
                <div>
                    <input 
                        className = "PropertyInput"
                        value = {addLinkName} 
                        onChange = {e => { setLinkName(e.target.value)}}
                        placeholder = "Property Description e.g. Snake House"
                    />
                </div>
                <div>
                    <input
                        className = "PropertyInput"
                        value={addLink}
                        onChange={e => setLink(e.target.value)}
                        placeholder="Zillow URL e.g. https://www.zillow.com/homedetails/48-Winding-Ln-Feasterville-PA-19053/9025882_zpid/"
                    />
                </div>
                <div>
                    <MdAdd className="newPropIcon" onClick={addZillowLink} title="Add Property" />
                    <MdCancel className="newPropIcon" onClick={removeAddClick} title="Cancel" />
                </div>
            </div>)
    } else {
        return 
    }
};