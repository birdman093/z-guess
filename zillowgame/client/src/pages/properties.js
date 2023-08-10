import React, {useEffect, useState} from "react";
import {MdAdd, MdCancel} from "react-icons/md";
import {AddressInUse} from '../config/ServerConfig.mjs';
import ReactDOM from "react-dom";
import userObj from "../utility/UserProps.mjs";
import {numFormat, priceFormat, guessFormat} from "../utility/InputFormat.mjs";
import { UserLoggedIn, UpdateUserScore } from "../utility/UpdateUser.mjs";
import {ValidateProperty, InvalidPostResponse} from "../utility/ValidateProperty.mjs";

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

        const response = await fetch(`${AddressInUse}/GET/properties/${userObj.userName}`);
        const zillowProperties = await response.json();
        setZillowProperties(zillowProperties);
    }

    // Load Score Stored in DB for userName
    const loadScore = async () => {
        if (!UserLoggedIn()) {return;}

        let userName = userObj.userName;
        const userLogin = {userName};
        const response = await fetch(`${AddressInUse}/GET/user/score`, {
            method: 'POST',
            body: JSON.stringify(userLogin),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resValue = await response.json();
        console.log(resValue);
        console.log(resValue[0].Score);
        UpdateUserScore(resValue[0].Score);
        const userScore = resValue[0].Score;
        setUserScore(userScore);
    }

    // Add new Property to DB and update Displayed Properties
    const addZillowLink = async() => {

        if (!UserLoggedIn()) {return;}

        let url = document.getElementById("urlInp").value;
        let name = document.getElementById("nameInp").value;
        if (!ValidateProperty(url,name)) {return;}

        let userName = userObj.userName;

        const response = await fetch(`${AddressInUse}/POST/properties`, {
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

    // add new property to be displayed
    const addGuess = async(property) => {
        let propertyID = property.PropertyID; let sellPrice = property.SellPrice;
        let guess = document.getElementById("guessInp"+propertyID).value;
        let userName = userObj.userName; let score = userObj.score;
        
        const newGuess = {propertyID, sellPrice, score, userName, guess};
     
        const response = await fetch(`${AddressInUse}/POST/guess`, {
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

    // UI Input for Properties
    const PropertyLinkInput = () => {
        return <div>
                    <input className = "newPropAdd" id="nameInp" placeholder="Property Description i.e Snake House"/>
                    <input className = "newPropAdd" id="urlInp" placeholder="Zillow URL link i.e. https://www.zillow.com/homedetails/123-Generic-Ave-City-State-07080/40084001_zpid/"/>
                    <MdAdd className = "newPropAdd" onClick = {addZillowLink}/>
                    <MdCancel className = "newPropAdd" onClick = {removeAddClick}/>
                </div>
    };

    const GuessInputDisplay = (property) => {
        if (property.SellPrice === null || property.Guess === null){
            return <input id = {"guessInp"+property.PropertyID} onKeyUp={(id) => numFormat(id)} placeholder="enter guess!"/>
        } else {
            return
        }
    }

    const GuessInputAddDisplay = (property) => {
        if (property.SellPrice === null || property.Guess === null){
            return <MdAdd onClick={() => AddGuessInput(property)}/>
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
        let guess = document.getElementById("guessInp"+property.PropertyID).value
        if (guess.length > 3 && guess.length < 10){
            addGuess(property);
        } else if (guess.length < 4) {
            alert("Invalid Guess: Guess must be greater than $999");
        } else if (guess.length > 10) {
            alert("Invalid Guess: Guess must be smaller than $1,000,000,000");
        } else {
            alert("Invalid Guess Input")
        }
    }

    // Display Rows of Data
    function PropertyDisplay({properties}) {
        return (
            <div>
                {addField}
                <table>
                    <thead>
                        <tr>
                            <td width = "75px" className = "propHeader">PropertyID</td>
                            <td width = "200px" className = "propHeader">Name</td>
                            <td width = "250px" className = "propHeader">URL</td>
                            <td width = "200px" className = "propHeader">StreetAddress</td>
                            <td width = "100px" className = "propHeader">City</td>
                            <td width = "35px" className = "propHeader">State</td>
                            <td width = "50px" className = "propHeader">ZipCode</td>
                            <td width = "75px" className = "propHeader">ListPrice</td>
                            <td width = "75px" className = "propHeader">Zestimate</td>
                            <td width = "75px" className = "propHeader">Sell Price</td>
                            <td width = "75px" className = "propHeader">Guess</td>
                            <td width = "75px"className = "propHeader">     </td>
                            <td width = "25px"className = "propHeader">     </td>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property, idx) => <PropertyMap property={property} key={idx} />)}
                    </tbody>
                </table>
            </div>
        );
    }


    // Mapping Function
    function PropertyMap({property}) {
        return (
            <tr id={property.PropertyID}>
                <td>{property.PropertyID}</td>
                <td>{property.Name}</td>
                <td>
                    <a href = {property.Url}>{property.StreetAddress + " " + property.City + ", " + property.State}</a>
                </td>
                <td>{property.StreetAddress}</td>
                <td>{property.City}</td>
                <td>{property.State}</td>
                <td>{property.ZipCode}</td>
                <td>{priceFormat(property.ListPrice)}</td>
                <td>{priceFormat(property.Zestimate)}</td>
                <td>{guessFormat(property.Guess,property.SellPrice)}</td>
                <td>{priceFormat(property.Guess)}</td>
                <td>{GuessInputDisplay(property)}</td>
                <td>{GuessInputAddDisplay(property)}</td>
            </tr>
        );
    }

    // Base Page Template
    return(
        <div>
        <h1>User Property History</h1>
        <p className = "addButton" id = "userScore">{userObj.firstName + " " + userObj.lastName + " Score: " + userScore}</p>
        <p>Add new properties, make guesses on loaded properties, and wait for results to come in on sold properties!</p>
        <button className = "addButton" onClick={onAddClick}>+ Add New Item</button>
        <PropertyDisplay properties={zillowProperties}/>
        </div>
    )
}

export default Properties;