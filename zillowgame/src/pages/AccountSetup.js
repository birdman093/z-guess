import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import {AddressInUse} from "../ServerConstant.js";
import userObj from "./user.js";
import ReactDOM from "react-dom";

function AccountSetup() {
    //TODO: 4.) Make Display Permanent between usages --> needs to load when opening
    useEffect(() => {
        CurrLogIn();
    }, []);

    const VerifyPassword = async () => {
        let userName = document.getElementById("userNameInp").value;
        let password = document.getElementById("passwordInp").value;
        const userLogin = {userName, password};

        if (userName.length === 0) {
            alert("Invalid UserName Entry")
            return
        } else if (password.length === 0) {
            alert("Invalid password Entry")
            return
        }
     
        const response = await fetch(`${AddressInUse}/GET/user`, {
            method: 'POST',
            body: JSON.stringify(userLogin),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resValue = await response.json();
        if (resValue.length > 0){
            userObj.userName = userName;
            userObj.firstName = resValue[0].FirstName;
            userObj.lastName = resValue[0].LastName;
            userObj.score = resValue[0].Score;
            console.log(userObj);
            //TODO: 4 move this to CurrLogIn
            document.getElementById("Greeting").innerHTML = "Hello " + userObj.firstName + " " + userObj.lastName + " with a score of " + userObj.score;
        } else {
            userObj.userName = "";
            userObj.firstName = "";
            userObj.lastName = "";
            userObj.score = "";
            document.getElementById("Greeting").innerHTML = "Invalid Sign-In: No User Logged In";
        }
    }

    const CurrLogIn = () => {
        
        if (userObj.userName === ""){
            document.getElementById("Greeting").textContent = "No User Logged In"
        } else {
            document.getElementById("Greeting").textContent = "Hello " + userObj.firstName + " " + userObj.lastName + " with a score of " + userObj.score;
        }
        
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
        <button onClick = {VerifyPassword}>Verify</button>
        <p id = "Greeting"></p>
        </>
    )
}

export default AccountSetup;