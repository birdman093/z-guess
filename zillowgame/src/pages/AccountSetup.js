import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdDelete, MdEdit, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse} from "../ServerConstant.js";
import ReactDOM from "react-dom";
import userObj from "./user.js";

function AccountSetup() {

    const VerifyPassword = async () => {
        let userName = document.getElementById("userNameInp").value;
        let password = document.getElementById("passwordInp").value;
        const userLogin = {userName, password}
     
        const response = await fetch(`${AddressInUse}/POST/user`, {
            method: 'POST',
            body: JSON.stringify(userLogin),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resValue = await response.json();
        userObj.firstName = resValue.FirstName;
        userObj.lastName = resValue.LastName;
        userObj.score = resValue.Score;
        document.getElementById("firstNameInp").value = userObj.firstName;
        document.getElementById("lastNameInp").value = userObj.LastName;
        document.getElementById("scoreInp").value = userObj.Score;
    }

    // Base Page Template
    return(
        <>
        <Header/>
        <SideBar />
        <h1>Account Login</h1>
        <p>Login To Your Account Here!  Contact the DB Admin if your login does not work!</p>
        <label>UserName: </label>
        <input id ="userNameInp"></input>
        <label>Password: </label>
        <input id = "passwordInp"></input>
        <button onClick = {VerifyPassword}></button>
        <p id = "firstNameOut"></p>
        <p id = "lastNameOut"></p>
        <p id = "scoreOut"></p>
        </>
    )
}

export default AccountSetup;