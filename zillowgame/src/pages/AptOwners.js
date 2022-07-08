import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdDelete, MdEdit, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse} from "../ServerConstant.js";
import ReactDOM from "react-dom";

function AptOwners() {
    useEffect(() => {
        loadAptOwners();
    }, []);

    const [aptOwnerList, setAptOwnersList] = useState([]);
    //const [addField, setAddField] = useState([])
    //const [aptOwnerForUpdate, setAptOwnerForUpdate] = useState([])
    //const [isShowing, setIsShowing] = useState(false);

    const loadAptOwners = async () => {
        const response = await fetch(`${AddressInUse}/GET/logins`);
        const aptOwnersList = await response.json();
        //aptOwnersList.forEach((item) => item.ssn = ComposeSSN(item.ssn));
        setAptOwnersList(aptOwnersList);
    }
    /*
    const toggle = (isShowing) => {
        setIsShowing(!isShowing);
    }

    const ComposeSSN = (ssn) => {
        if (ssn.length > 0){
            return "xxx-xx-" + ssn.slice(5,9);
        } else {
            return "";
        }
        
    } 

    const DeComposeSSN = (ssn) => {
        if (ssn.length > 0){
            return ssn.slice(0,3) + ssn.slice(4,6) + ssn.slice(7,11);
        } else {
            return "";
        }
    }

    const addAptOwners = async() => {
        let firstName = document.getElementById("firstNameInp").value;
        let lastName = document.getElementById("lastNameInp").value;
        let ssn = DeComposeSSN(document.getElementById("ssnInp").value);

        //validate input
        if (firstName.length < 1) {
            alert("Invalid First Name");
            return;
        } else if (lastName.length < 1) {
            alert("Invalid Last Name");
            return;
        } else if (ssn.length !== 0 && ssn.length !== 9) {
            alert("Insufficient length of ssn");
            return;
        }

        if (ssn.length === 0){
            ssn = '';
        }

        const newAptOwner = {firstName, lastName, ssn}
        const response = await fetch(`${AddressInUse}/POST/aptOwners`, {
            method: 'POST',
            body: JSON.stringify(newAptOwner),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201){
            alert("Successfully added the record!");
            loadAptOwners();
            removeAddClick();
        } else {
            if (response.status === 410) {
                alert(`Failed to add record due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add record due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

    const delAptOwners = async(ownerID) => {
        console.log(`Starting process with ${ownerID}`)
        const response = await fetch(`${AddressInUse}/DELETE/aptOwners/${ownerID}`, {
            method: 'DELETE'
        });
        if(response.status >= 200 && response.status < 400){
            alert("Successfully deleted the record!");
            loadAptOwners();
        } else {
            alert(`Failed to delete record, status code = ${response.status}`);
        }
    }
    const updateAptOwners = async(aptOwnerForUpdate, firstName, lastName, ssn) => {
        if(typeof firstName === "object" || firstName === ''){
            firstName = aptOwnerForUpdate.firstName;
        }
        if(typeof lastName === "object" || lastName === ''){
            lastName = aptOwnerForUpdate.lastName;
        }
        if(typeof ssn === "object" || ssn === ''){
            ssn = aptOwnerForUpdate.ssn;
        }
        ssn = ssn.replaceAll("-", "")

        const response = await fetch(`${AddressInUse}/PUT/aptOwners/${aptOwnerForUpdate.ownerID}`, {
            method: 'PUT',
            body: JSON.stringify({firstName:firstName, lastName:lastName, ssn:ssn}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status >= 200 && response.status < 400 ){
            alert("Successfully updated the record!");
            await loadAptOwners();
            window.location.reload();
        }
        else {
            if (response.status === 425) {
                alert("No Changes Made. Update did not change original entry.")

            } else if (response.status === 410) {
                alert("No Changes Made. Duplicate Entry")
            }
            else {
                alert(`Failed to update record, status code = ${response.status}`);
            }
        }
    }

    const openUpdateForm = async(aptOwner) => {
        setAptOwnerForUpdate(aptOwner)
        toggle(isShowing);
    }
    const filterResults = async (id) => {
        if(id == null){
            id = '';
        }
        const response = await fetch(`${AddressInUse}/GET/aptOwners/${id}`)
        const aptOwnerList = await response.json();
        setAptOwnersList(aptOwnerList);
    }
    */                

    // Input function
    const AptOwnerInput = () => {
        return <tr>
                    <td></td>
                    <td><input id="firstNameInp" placeholder="First Name e.g. Dan" onKeyUp={FirstNameFormat}/></td>
                    <td><input id="lastNameInp" placeholder="Last Name e.g. Smith" onKeyUp={LastNameFormat}/></td>
                    <td><input id="ssnInp" placeholder="[Optional] SSN e.g. 111-22-3333" onKeyUp={SSNInputFormat}/></td>
                    <td><MdAdd onClick = {addAptOwners}/></td>
                    <td><MdCancel onClick = {removeAddClick}/></td>
                </tr>
    };

    /*
    const onAddClick = event => {
        setAddField(<AptOwnerInput/>);
    };

    const removeAddClick = event => {
        setAddField();
    };
    */

    // Display Rows of Data
    function AptOwnerList({aptOwners}) {
        return (
            <table>
                <thead>
                    <tr>
                        <th>UserName</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {aptOwners.map((aptOwner, idx) => <AptOwner aptOwner={aptOwner} key={idx} />)}
                </tbody>
            </table>
        );
    }


    // Mapping Function
    function AptOwner({ aptOwner}) {
        return (
            <tr id={aptOwner.username}>
                <td>{aptOwner.username}</td>
                <td>{aptOwner.password}</td>
            </tr>
        );
    }


    // Base Page Template
    return(
        <>
        <Header/>
        <SideBar />
        <h1>Header 1</h1>
        <p>Some Info Here</p>
        <button>+ Add New Item</button>
        <AptOwnerList aptOwners={aptOwnerList}/>
        </>
    )
}

export default AptOwners;