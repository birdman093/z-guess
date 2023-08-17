import errorMessage from "./error.js";

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

