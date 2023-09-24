import React, {useState, useEffect } from 'react';
import { useUser } from '../components/UserProvider.js';
import {AddressInUse} from "../config/ServerConfig.js";
import './Account.css';

function Account() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [greeting, setGreeting] = useState('');
    const {user, SetUserContext, GreetingMessage} = useUser();
    const [loginAttempted, setLoginAttempted] = useState(false);
    
    useEffect(() => {
        if (loginAttempted) {
            setGreeting(GreetingMessage(false));
        } else {
            setGreeting(GreetingMessage(true));
        }
      }, [user, loginAttempted, GreetingMessage]);

    const VerifyPassword = async () => {
        
        if (userName.length === 0) {
            alert("Invalid UserName Entry")
            return
        } else if (password.length === 0) {
            alert("Invalid password Entry")
            return
        }
        const userLogin = {userName, password};
        const response = await fetch(`${AddressInUse}/user`, {
            method: 'POST',
            body: JSON.stringify(userLogin),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': `true`,
                'Access-Control-Allow-Origin': '*'
            }
        });

        const userResponse = await response.json();
        await SetUserContext(userResponse);
        setLoginAttempted(true);
        setGreeting(GreetingMessage(false));
        
    }

    // Base Page Template
    return(
        <div>
            <h1>Account Login</h1>
            <div className = "AccountContainer">
                <label>UserName: </label>
                <input className = "accountAdd" value={userName} onChange={e => setUserName(e.target.value)}></input>
                <br></br>
                <label>Password: </label>
                <input className = "accountAdd" type = "password" value={password} onChange={e => setPassword(e.target.value)}></input>
                <br></br>
                <button onClick = {VerifyPassword}>Verify</button>
            </div>
            {greeting}
            <div className="centered-box">
                <span>Project limited to 45 api calls/ month</span> 
                <span>Use Test Login Account</span>
                <br></br>
                <span>Username: featheru</span>
                <span>Password: log</span>
            </div>
        </div>
    )
}

export default Account;