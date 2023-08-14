import React, {useEffect} from "react";
import {AddressInUse} from "../config/ServerConfig.mjs";
import userObj from "../utility/UserProps.mjs";
import { SetValidUserGreeting, UpdateUser } from "../utility/UpdateUser.mjs";
import './Account.css';

function Account() {
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
     
        const response = await fetch(`${AddressInUse}/user`, {
            method: 'POST',
            body: JSON.stringify(userLogin),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resValue = await response.json();
        UpdateUser(resValue);
    }

    const CurrLogIn = () => {
        SetValidUserGreeting(userObj.userName !== "",true);
    }

    // Base Page Template
    return(
        <div>
        <h1>Account Login</h1>
        <div className = "AccountContainer">
            <label>UserName: </label>
            <input className = "accountAdd" id ="userNameInp"></input>
            <br></br>
            <label>Password: </label>
            <input className = "accountAdd" type = "password" id = "passwordInp"></input>
            <br></br>
            <button onClick = {VerifyPassword}>Verify</button>
        </div>
        <p id = "Greeting"></p>
        </div>
    )
}

export default Account;