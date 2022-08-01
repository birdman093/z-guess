import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import {MdAdd, MdCancel} from "react-icons/md";
import {AddressInUse} from "../ServerConstant.js";
import ReactDOM from "react-dom";
import userObj from "./user.js";

function DisplayProperties() {
    useEffect(() => {
        loadProperties();
    }, []);

    const [zillowProperties, setZillowProperties] = useState([]);
    const [addField, setAddField] = useState([])

    // Load Properties Stored in DB for userName
    const loadProperties = async () => {
        if (userObj.firstName.length === 0){
            alert("Please Login at Account Page to View Properties");
            return;
        }
        const response = await fetch(`${AddressInUse}/GET/properties/${userObj.userName}`);
        const zillowProperties = await response.json();
        setZillowProperties(zillowProperties);
    }

    //TODO: 2.) Move this to seperate location
    function numFormat(event) {
        var tag = document.getElementById(event.target.id);
        let val = tag.value.replace(/[^0-9.]/g,'');
        tag.value = val;
    }

    // Add new Property to DB and update Displayed Properties
    const addZillowLink = async() => {
        if (userObj.userName.length === 0){
            alert("Please Login at Account Page to View Properties")
            return;
        }
        let url = document.getElementById("urlInp").value;
        let name = document.getElementById("nameInp").value;
        let userName = userObj.userName;

        if (url.length === 0 || !url.includes("https://www.zillow.com/homedetails/") || !url.includes("zpid") ){
            alert("Invalid URL:  Sample format: https://www.zillow.com/homedetails/72-Hilton-Ave-Maplewood-NJ-07040/69527814_zpid/");
            return;
        }

        if (name.length === 0){
            alert("Please Name your property");
            return;
        }

        
        const newLink = {name,url,userName};
        const response = await fetch(`${AddressInUse}/POST/properties`, {
            method: 'POST',
            body: JSON.stringify(newLink),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        //TODO: 1.) CHANGE THIS URL RESPONSE TO BE THE ADDRESS
        //const addedProp = await response.json();
        // if added property --> url thing
        if(response.status === 201){
            alert(`Successfully added ${url}!`);
            loadProperties();
            removeAddClick();
        } else {
            if (response.status === 410) {
                alert(`Failed to add ${url} due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                console.log(response)
                alert(`Failed to add ${url} due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

    // add new property to be displayed
    const addGuess = async(aptOwner) => {
        console.log("here");
        if (userObj.userName.length === 0){
            alert("Please Login to view Properties at the Account Page")
        }
        let propertyID = aptOwner.PropertyID;
        let guess = document.getElementById("guessInp"+propertyID).value;
        let userName = userObj.userName;
        const newGuess = {propertyID, userName, guess}
     
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
        } else {
            if (response.status === 410) {
                alert(`Failed to add ${propertyID} guess due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add ${propertyID} guess due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
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

    
    const onAddClick = event => {
        setAddField(<PropertyLinkInput/>);
    };

    const removeAddClick = event => {
        setAddField();
    };

    const AddGuessInput = async(property) => {
        let guess = document.getElementById("guessInp"+property.PropertyID).value
        if (guess.length > 3 && guess.length < 10){
            console.log("validGuess")
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
                            <td className = "propHeader">PropertyID</td>
                            <td className = "propHeader">Name</td>
                            <td className = "propHeader">StreetAddress</td>
                            <td className = "propHeader">City</td>
                            <td className = "propHeader">State</td>
                            <td className = "propHeader">ZipCode</td>
                            <td className = "propHeader">ListPrice</td>
                            <td className = "propHeader">Zestimate</td>
                            <td className = "propHeader">Sell Price</td>
                            <td className = "propHeader">URL</td>
                            <td className = "propHeader">Guess</td>
                            <td className = "propHeader">     </td>
                            <td className = "propHeader">     </td>
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
                <td>{property.StreetAddress}</td>
                <td>{property.Town}</td>
                <td>{property.City}</td>
                <td>{property.ZipCode}</td>
                <td>{property.ListPrice}</td>
                <td>{property.Zestimate}</td>
                <td>{property.SellPrice}</td>
                <td>{property.Url}</td>
                <td>{property.Guess}</td>
                <td><MdAdd onClick={() => AddGuessInput(property)}/></td>
                <td><input id = {"guessInp"+property.PropertyID} onKeyUp={(id) => numFormat(id)} placeholder="enter guess!"/></td>
            </tr>
        );
    }

    // Base Page Template
    return(
        <>
        <Header/>
        <SideBar />
        <h1>Display Past, Present, and Future Guess Properties</h1>
        <p>Add new properties, Guess on existing properties, or Wait for results to come in on sold properties!</p>
        <button onClick={onAddClick}>+ Add New Item</button>
        <PropertyDisplay properties={zillowProperties}/>
        </>
    )
}

export default DisplayProperties;