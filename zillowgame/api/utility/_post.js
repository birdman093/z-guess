import { CalcPropScore } from "./_zillowPrice.js";
import errorMessage from './_error.js';

// Insert Query into SQL DB
export function insert(req, res, sql, inserts, connection) {
    return new Promise((resolve, reject) => {
        connection.query(sql,inserts,function(error, results, fields){
            if(error){
                SQLError(error, res)
                reject();
            } else {
                resolve();
            }
        });
    });
}

// Update Query into SQL DB -- T/F if anything changes
function update(req, res, sql, inserts, connection){
    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            SQLError(error, res)
        }
    });
}

// Insert Guess and then Update Score
export function setScore(req, res, connection) {
    var sql = "UPDATE AccountsToProperties SET Guess = $1 WHERE UserName = $2 AND PropertyID = $3" 
    var inserts = [req.body.guess, req.body.userName, req.body.propertyID, ];
    connection.query(sql,inserts,function(error, results, fields){
        
        if(error){
            SQLError(error, res);
        } else if (results.rowCount === 0)
        {
            res.status(400);
            res.write(errorMessage("DB-GuessToProperty"));
            res.end();
        }
        else {
            if (req.body.sellPrice !== null){
                var newScore = req.body.score + CalcPropScore(req.body.sellPrice, req.body.guess);
                var inserts2 = [newScore, req.body.userName];
                var sql2 = "UPDATE Accounts SET Score = $1 WHERE UserName = $2";
                update(req, res, sql2, inserts2, connection)
                res.status(201).json({"score": newScore})
                res.end();
            } else {
                res.status(201).json({"score": req.body.score});
                res.end();
            }
        }
    });
}

export function SQLError(error, res){
    res.status(400);
    if (error.code === "ER_DUP_ENTRY") {
        res.write(errorMessage("Duplicate"));
    } else {
        res.write(errorMessage("DB-Post"));
    }
    
    res.end();
}




