import {numFormat, priceFormat, guessFormat} from "../../utility/InputFormat.mjs";
import {MdAdd} from "react-icons/md";
import {AddressInUse} from '../../config/ServerConfig.mjs';
import {InvalidPostResponse} from "../../utility/ValidateProperty.mjs";

export const GuessInputDisplay = (property, setProperties) => {
    if (property.sellprice === null || property.guess === null){
        return <input
        className = "guessInput" 
        value = {property.unsetGuess}
        onChange = {(event) => numFormat(event, property.propertyid, setProperties)}
        placeholder="$2,093,068!"/>
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
    let guess = property.unsetGuess; //document.getElementById("guessInput-"+property.propertyid).value;
    if (guess.length > 3 && guess.length < 10){
        addGuess(property, setProperties, user, UpdateUserScore);
    } else if (guess.length < 4) {
        alert("Invalid - Guess must be greater than $999");
    } else if (guess.length > 10) {
        alert("Invalid - Guess must be smaller than $1,000,000,000");
    } else {
        alert("Invalid - Misc.")
    }
}

// add guess
const addGuess = async(property, setProperties, user, UpdateUserScore) => {
    let propertyID = property.propertyid; let sellPrice = property.sellprice;
    let guess = property.unsetGuess; //document.getElementById("guessInput-"+propertyID).value; // unsetGuess
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
        //document.getElementById("guessDisplay-"+property.propertyid).innerHTML = priceFormat(guess);
    } else {
        InvalidPostResponse(response, propertyID);
    }
}