import { CalcPropScore } from "./ZillowPrice.mjs";

// Generic Insert Query into SQL DB
export function Insert(req, res, sql, inserts, connection) {
    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(407);
            }
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(201);
            res.end();
        }
    });
}

//Insert Guess into DB and then Update Score Query
export function Insert_UpdateScore(req, res, connection) {
    var sql = "UPDATE LoginsToProperties SET Guess = ? WHERE UserName = ? AND PropertyID = ?" 
    var inserts = [req.body.guess, req.body.userName, req.body.propertyID, ];

    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(407);
            }
            res.write(JSON.stringify(error));
            res.end();
        }else{
            if (req.body.sellPrice !== null){
                var newScore = req.body.score + CalcPropScore(req.body.sellPrice, req.body.guess);
                var inserts2 = [newScore, req.body.userName];
                var sql2 = "UPDATE Logins SET Score = ? WHERE UserName = ?";
                Update(req, res, sql2, inserts2, connection)
            } else {
                res.status(201);
                res.end();
            }
        }
    });
}

// Generic update Query into SQL DB
function Update(req, res, sql, inserts, connection){
    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(406);
            }
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(201);
            res.end();
        }
    });
}


