export function numFormat(event, propertyID, setProperties) {
    // Get the input element and its value
    const input = event.target;
    const value = input.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    input.value = numericValue;

    setProperties(prevProps => prevProps.map(property => {
        if (property.propertyid === propertyID) {
            return {...property, unsetGuess: numericValue.toString()};
        }
        return property;
    }));

}

// Reformats returned price to $ with comma format
export function priceFormat(price) {

    if (price === null){ return "" }

    let strPrice = price.toString();
    let newprice = ""; let threeCounter = 0;

    for (let idx = strPrice.length-1; idx > -1; idx--) {
        newprice = strPrice[idx] + newprice;
        threeCounter += 1
        if (threeCounter === 3 && idx !== 0){
            newprice = "," + newprice
            threeCounter = 0
        }
    }
    return "$" + newprice
}

// Returns sellPrice if guess has been added
export function guessFormat(guess, sellPrice){
    if (guess > 0){
        return priceFormat(sellPrice);
    } else {
        return "";
    }
}