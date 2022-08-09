// Extracts sellPrice and listPrice of a house based on zillow history
export function GetZillowPrice(history) {
    console.log(history)

    let listPrice = null
    let sellPrice = null
    for (let idx = 0; idx < history.length; idx++){
        let currEvent = history[idx].event; let currDate = history[idx].date; let currPrice = history[idx].price;
        if (currEvent === "Sold" && sellPrice === null){
            sellPrice = currPrice
        } else if (currEvent === "Listed for sale"){ 
            listPrice = currPrice;
            break;
        }
    }
    return [listPrice,sellPrice]
}

// Calculate property score based on proximity function
export function CalcPropScore(sellPrice, guess){
    let targetZone = 0.025 * sellPrice;
    let diff = Math.abs(guess-sellPrice);
    return parseInt(targetZone/Math.pow((diff/targetZone)+1,2)); 
}