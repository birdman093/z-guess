import React, {useEffect, useState, useCallback} from "react";
import {AddressInUse} from '../config/ServerConfig.js';
import { useUser } from "../components/UserProvider.js";
import {ValidateProperty, InvalidPostResponse} from "../utility/ValidateProperty.js";
import { PropertyDisplay } from "./properties-components/propertyTable.js";
import { PropertyLinkInput } from "./properties-components/propertyAdd.js";
import './Properties.css';

export function Properties() {
    const [zillowProperties, setZillowProperties] = useState([]);
    const [inputFields, setInputFields] = useState(false);
    const [inputURL, setURL] = useState('');
    const [inputURLName, setURLName] = useState('');
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

        let userName = user.userName;
        let url = inputURL;
        let name = inputURLName;

        if (!ValidateProperty(url,name)) {return;}
        
        const response = await fetch(`${AddressInUse}/properties`, {
            method: 'POST',
            body: JSON.stringify({name,url,userName}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        removeAddClick();

        console.log(response);
        if(response.status === 201){
            alert(`Successfully added ${url}!`);
            const data = await response.json();
            const newData = { ...data, unsetGuess: '' };
            setZillowProperties(prevProps => [...prevProps, newData]);
        } else {
            InvalidPostResponse(response, url);
        }
    };
    
    const onAddClick = () => {
        setURL('');
        setURLName('');
        setInputFields(true);
    };

    const removeAddClick = () => {
        setInputFields(false);
    };

    return(
        <div>
        <h1>Property History</h1>
        <h3 id = "userScore">{user.firstName + " " + user.lastName + " - Score: " + user.score}</h3>
        <div className = "container">
            <button className = "addButton" onClick={onAddClick}>+ Add New Property</button>
            <PropertyLinkInput
                inputFields={inputFields}
                addLink={inputURL}
                setLink={setURL}
                addLinkName={inputURLName}
                setLinkName={setURLName}
                addZillowLink={addZillowLink}
                removeAddClick={removeAddClick}
            />
            <PropertyDisplay properties={zillowProperties} setProperties={setZillowProperties}
            user = {user} UpdateUserScore = {UpdateUserScore}/>
        </div>
        </div>
    )
}

export default Properties;