import errorMessage from "./_error.js";

export const propertyColumns = [
    "AccountsToProperties.PropertyID",
    "AccountsToProperties.Guess",
    "AccountsToProperties.Name",
    "AccountsToProperties.Description",
    "Properties.StreetAddress",
    "Properties.City",
    "Properties.State",
    "Properties.ZipCode",
    "Properties.ListPrice",
    "Properties.Zestimate",
    "Properties.SellPrice",
    "Properties.Url",
    "Properties.Image"
];

export function getOne(connection, sql, inserts, req, res) {
    connection.query(sql, inserts, function(error, results, fields){
        if(error){
            console.error("DB Error:", error);
            return res.status(400).json({ error: errorMessage("DB-Select") });
        }
        else if (results.rows.length === 1){
            return res.status(201).json(results.rows[0]);
        } else {
            return res.status(201).json({});
        }
        
    });
};

export function userExists(connection, inserts) {
    return new Promise((resolve, reject) => {
        var sql = `
        SELECT EXISTS(
            SELECT 1 FROM Accounts
            WHERE UserName = $1
        ) AS user_exists;`;

        connection.query(sql, inserts, (error, results, fields) => {
            if (error) {
                console.error("DB Error:", error);
                reject(error);
            } else {
                resolve(results.rows[0].user_exists);
            }
        });
    });
}

export function sendPropertyData(connection, res, userName, propertyID) {
    const qString = `
    SELECT
        ${propertyColumns.join(',\n    ')}
    FROM 
        Accounts 
    INNER JOIN 
        AccountsToProperties ON Accounts.UserName = AccountsToProperties.UserName 
    INNER JOIN 
        Properties ON AccountsToProperties.PropertyID = Properties.PropertyID 
    WHERE 
        Accounts.UserName = $1 AND Properties.PropertyID = $2`;

    connection.query(qString, [userName, propertyID],function(error, results, fields){
        console.log(error);
        console.log(results);
        if(error){
            res.write(errorMessage("DB-Select"));
            res.status(400).end();
        }
        else if (results.rows.length === 1){
            console.log("sending" + results.rows[0])
            return res.status(201).json(results.rows[0]);
        } else {
            return res.status(201).json({});
        }
    });
}

