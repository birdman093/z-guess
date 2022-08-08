// Takes input url and name and returns whether property is a valid input and displays an alert if not
export function ValidateProperty(url, name){
    if (url.length === 0 || !url.includes("https://www.zillow.com/homedetails/") || !url.includes("zpid") ){
        alert("Invalid URL:  Sample format: https://www.zillow.com/homedetails/72-Hilton-Ave-Maplewood-NJ-07040/69527814_zpid/");
        return false;
    }

    if (name.length === 0){
        alert("Please Name your property");
        return false;
    }
    return true
}

// Returns alert with string based on an invalid SQL post
export function InvalidPostResponse(response, identifier){
    if (response.status === 410) {
        alert(`Failed to add ${identifier} due to Duplicate Entry in DB, Server code = ${response.status}`)
    } else {
        alert(`Failed to add ${identifier} due to DB Error Code: ${response.status}, Server code = ${response.status}`);
    }
}




