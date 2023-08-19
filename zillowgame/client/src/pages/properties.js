import React, {useEffect, useState, useCallback} from "react";
import {AddressInUse} from '../config/ServerConfig.mjs';
import { useUser } from "../components/UserProvider.js";
import {ValidateProperty, InvalidPostResponse} from "../utility/ValidateProperty.js";
import { PropertyDisplay } from "./properties-components/propertyTable.js";
import { PropertyLinkInput } from "./properties-components/propertyAdd.js";
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
            const updatedData = data.map(item => ({ ...item, unsetGuess: '' }));
            setZillowProperties(updatedData);
        } catch (error) {
            console.error('Error loading properties:', error);
        }
    }, [user, UserLoggedIn]);

    useEffect(() => {
        loadProperties();
    }, [loadProperties]);

    // Add Property to DB, User
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
            const newData = { ...data, unsetGuess: '' };
            setZillowProperties(prevProps => [...prevProps, newData]);
        } else {
            InvalidPostResponse(response, url);
        }
    }
    
    const onAddClick = () => {
        setAddField(<PropertyLinkInput
            addLink={addLink}
            setLink={setLink}
            addLinkName={addLinkName}
            setLinkName={setLinkName}
            addZillowLink={addZillowLink}
            removeAddClick={() => setAddField(null)}
        />);
    };

    const removeAddClick = () => {
        setLink('');
        setLinkName('');
        setAddField();
    };

    // Base Page Template
    return(
        <div>
        <h1>Property History</h1>
        <h3 id = "userScore">{user.firstName + " " + user.lastName + " - Score: " + user.score}</h3>
        <div className = "container">
        <button className = "addButton" onClick={onAddClick}>+ Add New Property</button>
        {addField}
        <PropertyDisplay properties={zillowProperties} setProperties={setZillowProperties}
        user = {user} UpdateUserScore = {UpdateUserScore}/>
        </div>
        </div>
    )
}

export default Properties;