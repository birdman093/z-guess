import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdAirlineSeatLegroomExtra, MdCancel, MdDelete, MdEdit, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse} from "../ServerConstant.js";
import ReactDOM from "react-dom";

function DisplayProperties() {
    useEffect(() => {
        loadAptOwners();
    }, []);

    const [aptOwnerList, setAptOwnersList] = useState([]);
    const [addField, setAddField] = useState([])

    const loadAptOwners = async () => {
        //TODO: USERNAME ENTRY HERE
        let CURRENT_username = 0;
        const response = await fetch(`${AddressInUse}/GET/properties/${CURRENT_username}`);
        const aptOwnersList = await response.json();
        setAptOwnersList(aptOwnersList);
    }

    function numFormat(event) {
        var tag = document.getElementById(event.target.id);
        let val = tag.value.replace(/[^0-9.]/g,'');
        tag.value = val;
    }

    // add new property to be displayed
    const addAptOwners = async() => {
        //TODO: USERNAME ENTRY HERE
        let CURRENT_username = 0;
        let userName = CURRENT_username;
        let propertyID = document.getElementById("propertyIDInp").value;
        let name = document.getElementById("nameInp").value;
        let number = document.getElementById("numberInp").value;
        let street = document.getElementById("streetInp").value;
        let aptNum = document.getElementById("aptNumInp").value;
        let town = document.getElementById("townInp").value;
        let city = document.getElementById("cityInp").value;
        let zipCode = document.getElementById("zipCodeInp").value;
        let listPrice = document.getElementById("listPriceInp").value;
        let zestimate = document.getElementById("zestimateInp").value;
        let url = document.getElementById("urlInp").value;

        if (aptNum.length === 0){
            aptNum = '';
        }

        if (propertyID.length === 0 || name.length === 0 || number.length === 0 || street.length === 0 ||
            town.length === 0 || city.length === 0) {
                alert("missing field!")
                return
        }

        const newAptOwner = {userName, propertyID, name, number, street, aptNum, town, city, zipCode, listPrice, zestimate, url}
     
        const response = await fetch(`${AddressInUse}/POST/properties`, {
            method: 'POST',
            body: JSON.stringify(newAptOwner),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201){
            alert(`Successfully added ${propertyID}!`);
            loadAptOwners();
            removeAddClick();
        } else {
            if (response.status === 410) {
                alert(`Failed to add ${propertyID} due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add ${propertyID} due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

        // add new property to be displayed
    const addGuess = async(aptOwner) => {
        let propertyID = aptOwner.propertyID;
        let guess = document.getElementById("guessInp"+aptOwner.propertyID).value;
        let userName = 0;

        //TODO: Add UserName in
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
            loadAptOwners();
        } else {
            if (response.status === 410) {
                alert(`Failed to add ${propertyID} guess due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add ${propertyID} guess due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

    // UI Input for Properties
    const AptOwnerInput = () => {
        return <tr>
                    <td></td>
                    <td><input id="propertyIDInp" placeholder="distinct Zillow id e.g. xxxxx" onKeyUp={(id) => numFormat(id)}/></td>
                    <td><input id="nameInp" placeholder="nickname e.g. weird shaped house"/></td>
                    <td><input id="numberInp" placeholder="number to house e.g. 111 in 111 E. Seneca St."/></td>
                    <td><input id="streetInp" placeholder="number to house e.g. 111 in 111 E. Seneca St."/></td>
                    <td><input id="aptNumInp" placeholder="number to house e.g. 111 in 111 E. Seneca St."/></td>
                    <td><input id="townInp" placeholder="number to house e.g. 111 in 111 E. Seneca St."/></td>
                    <td><input id="cityInp" placeholder="number to house e.g. 111 in 111 E. Seneca St."/></td>
                    <td><input id="zipCodeInp" placeholder="number to house e.g. 111 in 111 E. Seneca St."/></td>
                    <td><input id="listPriceInp" placeholder="number to house e.g. 111 in 111 E. Seneca St." onKeyUp={(id) => numFormat(id)}/></td>
                    <td><input id="zestimateInp" placeholder="number to house e.g. 111 in 111 E. Seneca St." onKeyUp={(id) => numFormat(id)}/></td>
                    <td><input id="urlInp" placeholder="zillow url"/></td>
                    <td><MdAdd onClick = {addAptOwners}/></td>
                    <td><MdCancel onClick = {removeAddClick}/></td>
                </tr>
    };

    
    const onAddClick = event => {
        setAddField(<AptOwnerInput/>);
    };

    const removeAddClick = event => {
        setAddField();
    };

    const AddGuessInput = async(aptOwner) => {
        //Check there is no guess already --> send alert if guess already
        if (document.getElementById("guessInp").length > 3 && aptOwner.Guess === "0" && document.getElementById("guessInp").length < 10){
            addGuess(aptOwner);
        } else if (aptOwner.Guess.Length > 3){
            alert("Guess has already been Entered");
        } else if (document.getElementById("guessInp").length < 4) {
            alert("Invalid Guess Input: Input must be greater than $999");
        } else if (document.getElementById("guessInp").length > 10) {
            alert("Invalid Guess Input: Input must be smaller than $1,000,000,000");
        } else {
            alert("Invalid Guess Input")
        }
    }

    // Display Rows of Data
    function AptOwnerList({aptOwners}) {
        return (
            <table>
                <thead>
                    <tr>
                        <td>PropertyID</td>
                        <td>Name</td>
                        <td>Number</td>
                        <td>Street</td>
                        <td>AptNum</td>
                        <td>Town</td>
                        <td>City</td>
                        <td>ZipCode</td>
                        <td>ListPrice</td>
                        <td>Zestimate</td>
                        <td>Sell Price</td>
                        <td>URL</td>
                        <td>Guess</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {addField}
                    {aptOwners.map((aptOwner, idx) => <AptOwner aptOwner={aptOwner} key={idx} />)}
                </tbody>
            </table>
        );
    }


    // Mapping Function
    function AptOwner({ aptOwner}) {
        return (
            <tr id={aptOwner.PropertyID}>
                <td>{aptOwner.Name}</td>
                <td>{aptOwner.Number}</td>
                <td>{aptOwner.Street}</td>
                <td>{aptOwner.AptNum}</td>
                <td>{aptOwner.Town}</td>
                <td>{aptOwner.City}</td>
                <td>{aptOwner.ZipCode}</td>
                <td>{aptOwner.ListPrice}</td>
                <td>{aptOwner.Zestimate}</td>
                <td>{aptOwner.SellPrice}</td>
                <td>{aptOwner.Url}</td>
                <td>{aptOwner.Guess}</td>
                <td><MdEdit onClick={() => AddGuessInput(aptOwner)}/></td>
                <td><input id = {"guessInp"+aptOwner.PropertyID} onKeyUp={(id) => numFormat(id)}/></td>
            </tr>
        );
    }


    // Base Page Template
    return(
        <>
        <Header/>
        <SideBar />
        <h1>Display Past, Present, and Future Guess Properties</h1>
        <p>Add new properties by clicking the Add button, guess on existing properties, or wait for results to come in on sold properties!</p>
        <button onClick={onAddClick}>+ Add New Item</button>
        <AptOwnerList aptOwners={aptOwnerList}/>
        </>
    )
}

export default DisplayProperties;