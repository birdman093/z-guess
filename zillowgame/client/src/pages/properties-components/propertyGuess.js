import {numFormat} from "../../utility/InputFormat.js";
import {MdAdd} from "react-icons/md";
import {AddressInUse} from '../../config/ServerConfig.mjs';
import {InvalidPostResponse} from "../../utility/ValidateProperty.js";

export const GuessInputDisplay = (property, setProperties) => {
    if (property.sellprice === null || property.guess === null){
        return (<input
        className = "guessInput" 
        value = {property.unsetGuess}
        onChange = {(e) => numFormat(e, property.propertyid, setProperties)}
        placeholder="$2,093,068!"/>)
    } else {
        return
    }
}

export const GuessInputAddDisplay = (property, setProperties, user, UpdateUserScore) => {
    if (property.sellprice === null || property.guess === null){
        return <MdAdd className = "guessIcon" onClick={() => AddGuessInput(property, setProperties, user, UpdateUserScore)}/>
    } else {
        return
    }
};

const AddGuessInput = async(property, setProperties, user, UpdateUserScore) => {
    let guess = property.unsetGuess;
    let guessValue = parseInt(guess, 10); // Convert the guess string to an integer
    console.log(guessValue);

    if (guessValue >= 1000 && guessValue < 1000000000) {
        SetGuessApi(property, setProperties, user, UpdateUserScore);
    } else if (guessValue < 1000) {
        alert("Invalid - Guess must be greater than or equal to $1,000");
    } else if (guessValue >= 1000000000) {
        alert("Invalid - Guess must be less than or equal to $1,000,000,000");
    } else {
        alert("Invalid - Misc.")
    }
}


const SetGuessApi = async(property, setProperties, user, UpdateUserScore) => {
    let propertyID = property.propertyid; let sellPrice = property.sellprice;
    let guess = property.unsetGuess;
    let userName = user.userName; let score = user.score;
    
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
        const resValue = await response.json();
        UpdateUserScore(resValue.score);
        setProperties(prevProps => prevProps.map(property => {
            if (property.propertyid === propertyID) {
                return {...property, guess};
            }
            return property;
        }));
    } else {
        InvalidPostResponse(response, propertyID);
    }
}