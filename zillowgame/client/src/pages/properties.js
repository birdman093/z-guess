import React, {useEffect, useState, useCallback} from "react";
import {MdAdd, MdCancel} from "react-icons/md";
import {AddressInUse} from '../config/ServerConfig.mjs';
import { useUser } from "../components/UserProvider.js";
import {ValidateProperty, InvalidPostResponse} from "../utility/ValidateProperty.mjs";
import { PropertyDisplay } from "./properties-components/propertyTable.js";
import './Properties.css';

export function Properties() {
    const [zillowProperties, setZillowProperties] = useState([]);
    const [addField, setAddField] = useState([]);
    const [addLink, setLink] = useState();
    const [addLinkName, setLinkName] = useState();
    
    const {user, UserLoggedIn, UpdateUserScore} = useUser();

    const loadProperties = useCallback(async () => {
        if (!UserLoggedIn()) return;

        try {
            const response = await fetch(`${AddressInUse}/properties/${user.userName}`);
            const data = await response.json();
            setZillowProperties(data);
        } catch (error) {
            console.error('Error loading properties:', error);
        }
    }, [user, UserLoggedIn]);

    useEffect(() => {
        loadProperties();
    }, [loadProperties]);

    // Add Property
    const addZillowLink = async() => {
        if (!UserLoggedIn()) {return;}

        let url = addLink;
        let name = addLinkName;

        if (!ValidateProperty(url,name)) {return;}

        let userName = user.userName;

        removeAddClick();
        const response = await fetch(`${AddressInUse}/properties`, {
            method: 'POST',
            body: JSON.stringify({name,url,userName}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        if(response.status === 201){
            alert(`Successfully added ${url}!`);
            const data = await response.json();
            console.log(data);
            setZillowProperties(prevProps => [...prevProps, data]);
        } else {
            InvalidPostResponse(response, url);
        }
    }

    // Add Properties Section
    const PropertyLinkInput = () => {
        return (
        <div className = "PropertyAddBox">
            <div>
                <input 
                className = "PropertyInput"
                placeholder="Property Description e.g. Snake House"
                value={addLinkName} 
                onChange={(e) => {
                    console.log("URL:", e.target.value);
                    setLinkName(e.target.value);
                }}/>
            </div>
            <div>
                <input
                    className = "PropertyInput"
                    placeholder="Zillow URL e.g. https://www.zillow.com/homedetails/48-Winding-Ln-Feasterville-PA-19053/9025882_zpid/"
                    value={addLink}
                    onChange={(e) => {
                        console.log("URL:", e.target.value);
                        setLink(e.target.value);
                    }}/>
            </div>
            <div>
                <MdAdd className="newPropIcon" onClick={addZillowLink} title="Add Property" />
                <MdCancel className="newPropIcon" onClick={removeAddClick} title="Cancel" />
            </div>
        </div>)
    
    };
    
    const onAddClick = event => {
        setAddField(<PropertyLinkInput/>);
    };

    const removeAddClick = event => {
        setAddField(<></>);
    };

    // Base Page Template
    return(
        <div>
        <h1>Property History</h1>
        <h3 id = "userScore">{user.firstName + " " + user.lastName + " - Score: " + user.score}</h3>
        <div className = "container">
        <button className = "addButton" onClick={onAddClick}>+ Add New Property</button>
        {addField}
        <PropertyDisplay properties={zillowProperties} user = {user} UpdateUserScore = {UpdateUserScore}/>
        </div>
        </div>
    )
}

export default Properties;