import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        valid: false,
        userName: '',
        firstName: '',
        lastName: '',
        score: 0,
    });
    
    const GreetingMessage = (firstVisit = false) => {
        if (user.valid){
            return <p>Hello {user.firstName} {user.lastName}! Your score is currently {user.score}</p>
        } else if (firstVisit === false) {
            return <p>Invalid Sign-In: No User Logged In</p>
        } else {
            return <p>No User Logged In</p>
        }
    }

    const SetUserContext = (userObj) => {
        if (userObj && userObj.username && userObj.username.length > 0) 
        {   setUser({
                valid: true,
                userName: userObj.username,
                firstName: userObj.firstname,
                lastName: userObj.lastname,
                score: userObj.score,
            });
        } else 
        {   setUser({
                valid: false,
                userName: '',
                firstName: '',
                lastName: '',
                score: 0,
            });
        }
    };

    // Returns True if user is logged in, returns False if user is not logged in
    function UserLoggedIn(){
        if (user.userName.length === 0){
            alert("Please Login at Account Page to View Properties");
            return false;
        } else {
            return true;
        }
    }

    function UpdateUserScore(score){
        user.score = score
    };

    // Provide the user data and the setter function to the components
    return (
        <UserContext.Provider value={{ user, SetUserContext, GreetingMessage, UserLoggedIn, UpdateUserScore }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
