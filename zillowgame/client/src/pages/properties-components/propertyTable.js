import {priceFormat, guessFormat} from "../../utility/InputFormat.mjs";
import { GuessInputDisplay, GuessInputAddDisplay } from "./propertyGuess.js";

// Property Table Display
export function PropertyDisplay({properties, setProperties, user, UpdateUserScore}) {
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
                <PropertyMap property={property} setProperties={setProperties} user = {user} UpdateUserScore = {UpdateUserScore} key={idx} />)
                )}
            </tbody>
        </table>
    );
}

// Property Row Template
export function PropertyMap({property, setProperties, user, UpdateUserScore}) {
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
            <td>{priceFormat(property.guess)}</td>
            <td>
                <div className = "guessContainer">
                    {GuessInputDisplay(property, setProperties)}
                    {GuessInputAddDisplay(property, setProperties, user, UpdateUserScore)}
                </div>
            </td>
        </tr>
    );
}