// Error Messages
const errorMessages = {
    "DB-Select": "DB ERROR - Invalid Selection",
    "DB-Delete": "DB ERROR - Invalid Deletion",
    "DB-Post": "DB ERROR - Invalid Insert",

    "Duplicate": "Invalid Request -- DUPLICATE ENTRY",
    "Zillow": "Backend Error - ZILLOW API FAILURE",
    "Put": "PUT ERROR -- NO update has been made"
};

// Function to fetch the appropriate error message based on error code
function errorMessage(code) {
    return errorMessages[code] || "Backend Error - Unexpected error occurred";
}

export default errorMessage;
