import React, {useEffect, useState} from "react";
import {MdAdd, MdCancel} from "react-icons/md";
import {AddressInUse} from '../config/ServerConfig.mjs';
import ReactDOM from "react-dom";
import userObj from "../utility/UserProps.mjs";
import {numFormat, priceFormat, guessFormat} from "../utility/InputFormat.mjs";
import { UserLoggedIn, UpdateUserScore } from "../utility/UpdateUser.mjs";
import {ValidateProperty, InvalidPostResponse} from "../utility/ValidateProperty.mjs";
import './Properties.css';

export function Properties() {
    useEffect(() => {
        loadProperties();
        loadScore();
    }, []);

    const [zillowProperties, setZillowProperties] = useState([]);
    const [userScore, setUserScore] = useState([]);
    const [addField, setAddField] = useState([]);

    // Load Properties Stored in DB for userName
    const loadProperties = async () => {
        if (!UserLoggedIn()) {return;}

        const response = await fetch(`${AddressInUse}/properties/${userObj.userName}`);
        const zillowProperties = await response.json();
        setZillowProperties(zillowProperties);
    }

    // Load Score Stored in DB for userName
    const loadScore = async () => {
        if (!UserLoggedIn()) {return;}

        const response = await fetch(`${AddressInUse}/user/score/${userObj.userName}`);
        const resValue = await response.json();
        UpdateUserScore(resValue[0].score);
        const userScore = resValue[0].score;
        setUserScore(userScore);
    }

    // Add Property
    const addZillowLink = async() => {

        if (!UserLoggedIn()) {return;}

        let url = document.getElementById("urlInp").value;
        let name = document.getElementById("nameInp").value;
        if (!ValidateProperty(url,name)) {return;}

        let userName = userObj.userName;

        const response = await fetch(`${AddressInUse}/properties`, {
            method: 'POST',
            body: JSON.stringify({name,url,userName}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if(response.status === 201){
            alert(`Successfully added ${url}!`);
            loadProperties();
            removeAddClick();
        } else {
            InvalidPostResponse(response, url);
        }
    }

    // add guess
    const addGuess = async(property) => {
        let propertyID = property.propertyid; let sellPrice = property.sellprice;
        let guess = document.getElementById("guessInput-"+propertyID).value;
        let userName = userObj.userName; let score = userObj.score;
        
        const newGuess = {propertyID, sellPrice, score, userName, guess};
     
        const response = await fetch(`${AddressInUse}/user/guess`, {
            method: 'POST',
            body: JSON.stringify(newGuess),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201){
            alert(`Successfully added ${propertyID} guess!`);
            loadProperties();
            loadScore();
        } else {
            InvalidPostResponse(response, propertyID);
        }
    }

    // Add Properties
    const PropertyLinkInput = () => {
        return <div className = "PropertyAddBox">
        <div className = "propertyInput">
            <input
                className="newPropAdd"
                id="nameInp"
                placeholder="Property Description e.g. Snake House"
                
            />
        </div>
        <div className = "propertyInput">
            <input
                id="urlInp"
                placeholder="Zillow URL e.g. https://www.zillow.com/homedetails/48-Winding-Ln-Feasterville-PA-19053/9025882_zpid/"
            />
        </div>
        <div>
            <MdAdd className="newPropIcon" onClick={addZillowLink} title="Add Property" />
            <MdCancel className="newPropIcon" onClick={removeAddClick} title="Cancel" />
        </div>
    </div>
    
    };

    const GuessInputDisplay = (property) => {
        if (property.sellprice === null || property.guess === null){
            return <input
            className = "guessInput" 
            id = {"guessInput-"+property.propertyid} onKeyUp={(id) => numFormat(id)} 
            placeholder="$x,xxx,xxx!"/>
        } else {
            return
        }
    }

    const GuessInputAddDisplay = (property) => {
        if (property.sellprice === null || property.guess === null){
            return <MdAdd className = "guessIcon" onClick={() => AddGuessInput(property)}/>
        } else {
            return
        }
    };

    
    const onAddClick = event => {
        setAddField(<PropertyLinkInput/>);
    };

    const removeAddClick = event => {
        setAddField();
    };

    const AddGuessInput = async(property) => {
        let guess = document.getElementById("guessInput-"+property.propertyid).value;
        if (guess.length > 3 && guess.length < 10){
            addGuess(property);
        } else if (guess.length < 4) {
            alert("Invalid - Guess must be greater than $999");
        } else if (guess.length > 10) {
            alert("Invalid - Guess must be smaller than $1,000,000,000");
        } else {
            alert("Invalid - Misc.")
        }
    }

    // Property Table Display
    function PropertyDisplay({properties}) {
        return (
            <div>
                {addField}
                <table>
                    <thead>
                        <tr>
                            <th>Name - Description</th>
                            <th>Street Address - URL</th>
                            <th>List Price</th>
                            <th>Zestimate ®</th>
                            <th>Sell Price</th>
                            <th>Guess Price</th>
                            <th>Update Guess</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property, idx) => <PropertyMap property={property} key={idx} />)}
                    </tbody>
                </table>
            </div>
        );
    }

    // Property Row Template
    function PropertyMap({property}) {
        return (
            <tr id={property.propertyid}>
                <td>{property.name}</td>
                <td>
                    <a href={property.url} target="_blank" rel="noopener noreferrer">
                        {property.streetaddress + " " + property.city + ", " + property.state + " " + property.zipcode}
                    </a>
                </td>
                <td>{priceFormat(property.listprice)}</td>
                <td>{priceFormat(property.zestimate)}</td>
                <td>{guessFormat(property.guess,property.sellprice)}</td>
                <td>{priceFormat(property.guess)}</td>
                <td><div className = "guessContainer">{GuessInputDisplay(property)}{GuessInputAddDisplay(property)}</div></td>
            </tr>
        );
    }

    // Base Page Template
    return(
        <div>
        <h1>Property History</h1>
        <h3 id = "userScore">{userObj.firstName + " " + userObj.lastName + " - Score: " + userObj.score}</h3>
        <p>Add properties, make guesses, and wait for the results!</p>
        <div className = "container">
        <button className = "addButton" onClick={onAddClick}>+ Add New Property</button>
        <PropertyDisplay properties={zillowProperties}/>
        </div>
        </div>
    )
}

export default Properties;