import {numFormat, priceFormat, guessFormat} from "../../utility/InputFormat.mjs";
import { useUser } from "../../components/UserProvider.js";
import {MdAdd, MdCancel} from "react-icons/md";
import {AddressInUse} from '../../config/ServerConfig.mjs';
import {ValidateProperty, InvalidPostResponse} from "../../utility/ValidateProperty.mjs";

// Property Table Display
export function PropertyDisplay({properties, user, UpdateUserScore}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name - Description</th>
                    <th>Street Address - URL</th>
                    <th>List Price</th>
                    <th>Zestimate ®</th>
                    <th>Sell Price</th>
                    <th>Guess Price</th>
                    <th>Update Guess</th>
                </tr>
            </thead>
            <tbody>
                {properties.map(
                    (property, idx) => (
                <PropertyMap property={property} user = {user} UpdateUserScore = {UpdateUserScore} key={idx} />)
                )}
            </tbody>
        </table>
    );
}

// Property Row Template
export function PropertyMap({property, user, UpdateUserScore}) {
    return (
        <tr id={property.propertyid}>
            <td>{property.name}</td>
            <td>
                <a href={property.url} target="_blank" rel="noopener noreferrer">
                    {property.streetaddress + " " + property.city + ", " + property.state + " " + property.zipcode}
                </a>
            </td>
            <td>{priceFormat(property.listprice)}</td>
            <td>{priceFormat(property.zestimate)}</td>
            <td>{guessFormat(property.guess,property.sellprice)}</td>
            <td id = {"guessDisplay-"+property.propertyid}>{priceFormat(property.guess)}</td>
            <td>
                <div className = "guessContainer">{GuessInputDisplay(property)}{GuessInputAddDisplay(property,user, UpdateUserScore)}
                </div>
            </td>
        </tr>
    );
}

const GuessInputDisplay = (property) => {
    if (property.sellprice === null || property.guess === null){
        return <input
        className = "guessInput" 
        id = {"guessInput-"+property.propertyid} onKeyUp={(id) => numFormat(id)} 
        placeholder="$x,xxx,xxx!"/>
    } else {
        return
    }
}

const GuessInputAddDisplay = (property,user, UpdateUserScore) => {
    if (property.sellprice === null || property.guess === null){
        return <MdAdd className = "guessIcon" onClick={() => AddGuessInput(property, user, UpdateUserScore)}/>
    } else {
        return
    }
};

const AddGuessInput = async(property,user, UpdateUserScore) => {
    let guess = document.getElementById("guessInput-"+property.propertyid).value;
    if (guess.length > 3 && guess.length < 10){
        addGuess(property, user, UpdateUserScore);
    } else if (guess.length < 4) {
        alert("Invalid - Guess must be greater than $999");
    } else if (guess.length > 10) {
        alert("Invalid - Guess must be smaller than $1,000,000,000");
    } else {
        alert("Invalid - Misc.")
    }
}

// add guess
const addGuess = async(property, user, UpdateUserScore) => {
    let propertyID = property.propertyid; let sellPrice = property.sellprice;
    let guess = document.getElementById("guessInput-"+propertyID).value;
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
        console.log(guess);
        document.getElementById("guessDisplay-"+property.propertyid).innerHTML = priceFormat(guess);
    } else {
        InvalidPostResponse(response, propertyID);
    }
}