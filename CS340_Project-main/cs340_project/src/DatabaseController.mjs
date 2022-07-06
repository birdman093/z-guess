import express from 'express';
const PORT = 6363;
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';

//ERROR CODES
//404 -- PAGE NOT FOUND -- DB NOT WORKING DURING SELECTION
//405 -- ERROR DURING DELETION
//406 -- ERROR DURING PUT
//407 -- ERROR DURING INSERT
//410 -- INSERT/ PUT -- DUPLICATE ENTRY
//425 -- PUT ERROR -- NO update has been made

var connection = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_sheajon',
    password: '4132',
    database: 'cs340_sheajon'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//GET/ DISPLAY TABLES & FILTER DB Statements

app.get('/GET/aptFloors', function(req, res)
{
    connection.query("SELECT * FROM `AptFloors`",  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });                                                 
});

app.get('/GET/aptFloors/:id', function(req, res)
{
    connection.query(`SELECT * FROM AptFloors WHERE floorNum = ${req.params.id}`,  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });
});

app.get('/GET/aptOwners', function(req, res)
{
    connection.query("SELECT * FROM `AptOwners`",  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404).end();
        }
        res.json(results);
        res.status(201).end();
    });                                                 
});

app.get('/GET/aptOwners/:id', function(req, res)
{
    connection.query(`SELECT * FROM AptOwners WHERE ownerID = ${req.params.id}`,  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });
});

app.get('/GET/apts', function(req, res)
{
    let qString = 'SELECT AptOwners.ownerID, AptOwners.firstName, AptOwners.lastName, Apts.aptNum, Apts.sqFeet, Apts.floorNum ' +
    'FROM Apts LEFT JOIN AptOwners ON Apts.ownerID = AptOwners.ownerID;';
    connection.query(qString,  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404).end();
        }
        res.json(results);
        res.status(201).end();
    });                                                 
});

app.get('/GET/apts/:id', function(req, res)
{
    let searchID = req.params.id;
    let sql = "SELECT AptOwners.ownerID, AptOwners.firstName, AptOwners.lastName, Apts.aptNum, Apts.sqFeet, Apts.floorNum FROM Apts LEFT JOIN AptOwners ON Apts.ownerID = AptOwners.ownerID WHERE Apts.aptNum = ?;";
    console.log(sql,[searchID]);
    connection.query(sql,[searchID], function(error, results) {
    if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });
});

app.get('/GET/priceHistory', function(req, res)
{
    let qString = 'SELECT PH.invoiceNum, AO1.ownerID AS "sellerID", AO1.firstName AS "sellerFirstName", AO1.lastName AS "sellerLastName", ' +
    'AO2.ownerID AS "buyerID", AO2.firstName AS "buyerFirstName", AO2.lastName AS "buyerLastName", ' +
    'PH.aptNum, PH.dateSale, PH.price FROM PriceHistory AS PH ' +
    'LEFT JOIN AptOwners AS AO1 ON PH.sellerID = AO1.ownerID ' + 
    'LEFT JOIN AptOwners AS AO2 ON PH.buyerID = AO2.ownerID ' +
    'LEFT JOIN Apts ON Apts.aptNum = PH.aptNum;'
    connection.query(qString, {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.status(201);
        res.json(results);
        res.end();
    });                                                 
});

app.get('/GET/priceHistory/:id', function(req, res)
{
    const searchID = req.params.id;
    let sql = 'SELECT PH.invoiceNum, AO1.ownerID AS "sellerID", AO1.firstName AS "sellerFirstName", AO1.lastName AS "sellerLastName", AO2.ownerID AS "buyerID", AO2.firstName AS "buyerFirstName", AO2.lastName AS "buyerLastName", ' +
        'PH.aptNum, PH.dateSale, PH.price FROM PriceHistory AS PH ' +
        'LEFT JOIN AptOwners AS AO1 ON PH.sellerID = AO1.ownerID ' +
        'LEFT JOIN AptOwners AS AO2 ON PH.buyerID = AO2.ownerID ' +
        'LEFT JOIN Apts ON Apts.aptNum = PH.aptNum WHERE PH.invoiceNum = ?;'
    connection.query(sql, [searchID] , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });
});

app.get('/GET/rodents', function(req, res)
{
    connection.query("SELECT * FROM `Rodents`",  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });                                                 
});

app.get('/GET/rodents/:id', function(req, res)
{
    connection.query(`SELECT * FROM Rodents WHERE rodentID = ${req.params.id}`,  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });
});

app.get('/GET/rodentsToFloors', function(req, res)
{
    connection.query("SELECT Rodents.rodentID,Rodents.rodentName,RodentsToFloors.floorNum FROM Rodents JOIN RodentsToFloors ON Rodents.rodentID = RodentsToFloors.rodentID;",  
    {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });                                                 
});

app.get('/GET/rodentsToFloors/rodent/:rodentID', function(req, res)
{
    const searchID = req.params.id;
    let sql = "SELECT Rodents.rodentID,Rodents.rodentName,RodentsToFloors.floorNum FROM Rodents JOIN RodentsToFloors ON Rodents.rodentID = RodentsToFloors.rodentID WHERE RodentsToFloors.rodentID = ?;"
    connection.query(sql, [searchID],  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });
});

app.get('/GET/rodentsToFloors/floor/:floorNum', function(req, res)
{
    connection.query(`SELECT * FROM RodentsToFloors WHERE floorNum = ${req.params.floorNum}`,  {timeout: 40000} , function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404);
            res.end();
        }
        res.json(results);
        res.end();
    });
});

//POST/ INSERT INTO DB STatements

app.post('/POST/aptFloors', function(req, res)
{
    var sql = "INSERT INTO AptFloors (floorNum, fireExits) VALUES (?,?)";
    var inserts = [req.body.floorNum, req.body.fireExits];
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
            console.log(results);
            res.status(201);
            res.end();
        }
    });
});

app.post('/POST/aptOwners', function(req, res)
{
    var sql = "INSERT INTO AptOwners (firstName, lastName, ssn) VALUES (?,?,?)";
    var inserts = [req.body.firstName, req.body.lastName, req.body.ssn];
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
});

app.post('/POST/apts', function(req, res)
{
    req.body.ownerID = req.body.ownerID !== "NULL" ? req.body.ownerID : null;
    req.body.sqFeet = req.body.sqFeet !== "NULL" ? req.body.sqFeet : null;
    var sql = "INSERT INTO Apts (aptNum, sqFeet, floorNum, ownerID) VALUES (?,?,?,?)";
    var inserts = [req.body.aptNum, req.body.sqFeet, req.body.floorNum, req.body.ownerID];
    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(407);
            }
            console.log(JSON.stringify(error));
            res.write(JSON.stringify(error));
            res.end();
        }else {
            console.log(results);
            res.status(201);
            res.end();
        }
    });
});

app.post('/POST/priceHistory', function(req, res)
{
    req.body.sellerID = req.body.sellerID !== "NULL" ? req.body.sellerID : null;
    req.body.buyerID = req.body.buyerID !== "NULL" ? req.body.buyerID : null;
    var sql = "INSERT INTO PriceHistory (sellerID, buyerID, aptNum, dateSale, price) VALUES (?,?,?,?,?)";
    var inserts = [req.body.sellerID, req.body.buyerID, req.body.aptNum, req.body.dateSale, req.body.price];
    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            //res.write(JSON.stringify(error));
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410).end();
            } else {
                res.status(407).end();
            }
            
        }else{
            res.status(201).end();
        }
    });
});


app.post('/POST/rodents', function(req, res)
{
    var sql = "INSERT INTO Rodents (rodentName) VALUES (?)";
    var inserts = [req.body.rodentName];
    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(407);
            }
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(201);
            res.end();
        }
    });
});

app.post('/POST/rodentsToFloors', function(req, res)
{
    var sql = "INSERT INTO RodentsToFloors (rodentID,floorNum) VALUES (?,?)";
    var inserts = [req.body.rodentID, req.body.floorNum];
    connection.query(sql,inserts,function(error, results, fields){
        if(error){
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(407);
            }
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(201);
            res.end();
        }
    });
});

//DELETE DB STatements

app.delete('/DELETE/aptFloors/:floorNum', function(req, res)
{

    var sql = `DELETE FROM AptFloors WHERE floorNum = ?`;
    //var del = [req.params.floorNum];
    connection.query(sql,[req.params.floorNum],function(error, results){
        if(error){
            res.write(JSON.stringify(error));
            res.status(405);
            res.end();
        } else {
            res.json(results);
            res.end();
        }
    });
});

app.delete('/DELETE/aptOwners/:ownerID', function(req, res)
{
    var sql = `DELETE FROM AptOwners WHERE ownerID = ?`;
    //var del = [req.params.floorNum];
    connection.query(sql,[req.params.ownerID],function(error, results){
        if(error){
            res.write(JSON.stringify(error));
            res.status(405);
            res.end();
        } else {
            res.json(results);
            res.end();
        }
    });
});

app.delete('/DELETE/rodents/:rodentID', function(req, res)
{

    var sql = `DELETE FROM Rodents WHERE rodentID = ?`;
    //var del = [req.params.floorNum];
    connection.query(sql,[req.params.rodentID],function(error, results){
        if(error){
            res.write(JSON.stringify(error));
            res.status(405);
            res.end();
        } else {
            res.json(results);
            res.end();
        }
    });
});

app.delete('/DELETE/apts/:aptNum', function(req, res)
{

    var sql = `DELETE FROM Apts WHERE aptNum = ?`;
    //var del = [req.params.floorNum];
    connection.query(sql,[req.params.aptNum],function(error, results){
        if(error){
            res.write(JSON.stringify(error));
            res.status(405);
            res.end();
        } else {
            res.json(results);
            res.end();
        }
    });
});

app.delete('/DELETE/priceHistory/:invoiceNum', function(req, res)
{

    var sql = `DELETE FROM PriceHistory WHERE invoiceNum = ?`;
    connection.query(sql,[req.params.invoiceNum],function(error, results){
        if(error){
            res.write(JSON.stringify(error));
            res.status(405);
            res.end();
        } else {
            res.json(results);
            res.end();
        }
    });
});

app.delete('/DELETE/rodentsToFloors/:rodentID/:floorNum', function(req, res)
{
    console.log("AT THE SERVER WITH ")
    var sql = `DELETE FROM RodentsToFloors WHERE rodentID = ? AND floorNum = ?`;
    connection.query(sql,[req.params.rodentID, req.params.floorNum],function(error, results){
        if(error){
            res.write(JSON.stringify(error));
            res.status(405);
            res.end();
        } else {
            res.json(results);
            res.end();
        }
    });
});

//PUT/ UPDATE DB Statements

app.put('/PUT/aptFloors/:floorNum', function(req, res)
{
    let floorNum = req.params.floorNum;
    let fireExits = req.body.fireExits;
    let sql = "UPDATE AptFloors SET fireExits = ? WHERE floorNum = ?";
    connection.query(sql,[fireExits, floorNum], function(error, results) {
        if(error){
            res.write(JSON.stringify(error,results));
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(406);
            }
            res.end();
        }
        if (results.changedRows === 1){
            res.status(201);
        } else {
            res.status(425);
        } 
        res.end();
    });
});
app.put('/PUT/aptOwners/:ownerID', function(req, res)
{
    let firstName = req.body.firstName;
    let ownerID = req.params.ownerID;
    let lastName = req.body.lastName;
    let ssn = req.body.ssn;
    let sql = "UPDATE AptOwners SET firstName = ?, lastName = ?, ssn = ? WHERE ownerID = ?";
    connection.query(sql,[firstName, lastName, ssn, ownerID], function(error, results) {
        if(error){
            res.write(JSON.stringify(error,results));
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(406);
            }
            res.end();
        }
        if (results.changedRows === 1){
            res.status(201);
        } else {
            res.status(425);
        } 
        res.end();
    });
});

app.put('/PUT/apts/:aptNum', function(req, res)
{
    let sqFeet = req.body.sqFeet;
    let aptNum = req.params.aptNum;
    let ownerID = req.body.ownerID;
    let newAptNum = req.body.aptNum
    let floorNum = req.body.floorNum;
    let sql = "UPDATE Apts SET aptNum = ?, sqFeet = ?, ownerID = ?, floorNum = ? WHERE aptNum = ?";
    console.log(sql,[newAptNum, sqFeet, ownerID, floorNum, aptNum])
    connection.query(sql,[newAptNum, sqFeet, ownerID, floorNum, aptNum], function(error, results) {
        if(error){
            res.write(JSON.stringify(error,results));
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(406);
            }
            res.end();
        }
        else if (results.changedRows === 1){
            res.status(201);
        } else {
            res.status(425);
        } 
        res.end();
    });
});

app.put('/PUT/rodents/:rodentID', function(req, res)
{
    let rodentName = req.body.rodentName;
    let rodentID = req.params.rodentID;
    let sql = "UPDATE Rodents SET rodentName = ? WHERE rodentID = ?";
    connection.query(sql,[rodentName, rodentID], function(error, results) {
        if(error){
            res.write(JSON.stringify(error,results));
        }
        if (results.changedRows === 1){
            res.status(201);
        } else {
            res.status(425);
        }
        res.end();
    });
});

app.put('/PUT/priceHistory/:invoiceNum', function(req, res)
{
    let invoiceNum = req.params.invoiceNum;
    let sellerID = req.body.sellerID;
    let buyerID = req.body.buyerID;
    let aptNum = req.body.aptNum;
    let dateSale =req.body.dateSale;
    let price = req.body.price;
    let sql = "UPDATE PriceHistory SET sellerID = ?, buyerID = ?, aptNum = ?, dateSale = ?, price = ? WHERE invoiceNum = ?";
    connection.query(sql,[sellerID, buyerID, aptNum, dateSale, price, invoiceNum], function(error, results) {
        if(error){
            res.write(JSON.stringify(error,results));
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(406);
            }
            res.end();
        }
        else if (results.changedRows === 1){
            res.status(201);
        } else {
            res.status(425);
        }
        res.end();
    });
});


app.put('/PUT/rodentsToFloors/:rodentID/:floorNum', function(req, res)
{
    let floorNum = req.params.floorNum;
    let rodentID = req.params.rodentID;
    let newFloorNum =req.body.floorNum;
    let newRodentID = req.body.rodentID;
    let sql = "UPDATE RodentsToFloors SET rodentID = ?, floorNum = ? WHERE rodentID = ? AND floorNum = ?";
    connection.query(sql,[newRodentID, newFloorNum, rodentID, floorNum], function(error, results) {
        if(error){
            res.write(JSON.stringify(error,results));
            if (error.code === "ER_DUP_ENTRY") {
                res.status(410);
            } else {
                res.status(406);
            }
            res.end();
        }
        else if (results.changedRows === 1){
            res.status(201);
        } else {
            res.status(425);
        } 
        res.end();
    });
});



app.listen(PORT, () => {
    console.log("Express started on http://localhost:"+PORT+"; press Ctrl-C to terminate.");
});