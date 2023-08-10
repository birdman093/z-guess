import userObj from "./UserProps.mjs";

// Valid = True displays a valid greeting to the logged in user, If Valid = False displays invalid sign-in if not the first download, and No user 
// logged in if second download
export function SetValidUserGreeting(valid, first = false){
    if (valid) {
        document.getElementById("Greeting").innerHTML = "Hello " + userObj.firstName + " " + userObj.lastName + "! Your score is currently " + userObj.score;
    } else {
        if (first === false){
            document.getElementById("Greeting").innerHTML = "Invalid Sign-In: No User Logged In";
        } else {
            document.getElementById("Greeting").innerHTML = "No User Logged In"
        }
        
    }
}

// Updates User Properties based on input data
export function UpdateUser(resValue){
    if (resValue.length > 0){
        userObj.userName = resValue[0].UserName;
        userObj.firstName = resValue[0].FirstName;
        userObj.lastName = resValue[0].LastName;
        userObj.score = resValue[0].Score;
        SetValidUserGreeting(true);
    } else {
        userObj.userName = "";
        userObj.firstName = "";
        userObj.lastName = "";
        userObj.score = "";
        SetValidUserGreeting(false);   
    }
};

export function UpdateUserScore(score){
    userObj.score = score
};

// Returns True if user is logged in, returns False if user is not logged in
export function UserLoggedIn(){
    if (userObj.userName.length === 0){
        alert("Please Login at Account Page to View Properties");
        return false;
    } else {
        return true;
    }
}




