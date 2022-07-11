import express from 'express';
const PORT = 6363;
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
//import connection from './DatabaseConnection.js'
//TODO: Connection not importing?

//ERROR CODES
//404 -- PAGE NOT FOUND -- DB NOT WORKING DURING SELECTION
//405 -- ERROR DURING DELETION
//406 -- ERROR DURING PUT
//407 -- ERROR DURING INSERT
//410 -- INSERT/ PUT -- DUPLICATE ENTRY
//425 -- PUT ERROR -- NO update has been made


var connection = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs361_featheru',
    password: '9999',
    database: 'cs361_featheru'
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

//  LazyMan's Password Validation  --> need to figure out hashing approach
app.post('/GET/user', function(req, res)
{
    var sql = `SELECT FirstName, LastName, Score FROM Logins WHERE UserName = ? AND Password = ?`;
    connection.query(sql, [req.body.userName, req.body.password], function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404).end();
        }
        res.json(results);
        res.status(201).end();
    });                                              
});

app.get('/GET/properties/:userName', function(req, res)
{
    //TODO: Change from * to be more nuanced to avoid password!
    var qString = `SELECT * FROM Logins LEFT JOIN LoginsToProperties ON Logins.UserName = ` +
    `LoginsToProperties.UserName LEFT JOIN Properties ON LoginsToProperties.PropertyID = ` +
    `Properties.PropertyID WHERE Logins.UserName = ?`;

    connection.query(qString, [req.params.userName],function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404).end();
        }
        res.json(results);
        res.status(201).end();
    });                                                 
});

app.post('/POST/properties', function(req, res)
{
    var sql = "INSERT INTO `Properties`(`PropertyID`, `Name`, `Number`, `Street`," +
     "`AptNum`, `Town`, `City`, `ZipCode`, `ListPrice`, `Zestimate`, `SellPrice`, `Url`)" +
     " VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    
     let aptNum = req.body.aptNum;
    if (req.body.aptNum.length == 0){
        aptNum = null;
    }

    var inserts = [req.body.propertyID, req.body.name, req.body.number, req.body.street, aptNum, 
    req.body.town, req.body.city, req.body.zipCode, req.body.listPrice, req.body.zestimate, null, req.body.url];

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
            //res.end();
            var sql2 = "INSERT INTO `LoginsToProperties`(`UserName`, `PropertyID`, `Guess`) VALUES (?, ?, ?)";
            var inserts2 = [req.body.userName, req.body.propertyID, null];
            connection.query(sql2,inserts2,function(error, results, fields){
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
    });
});

app.post('/POST/guess', function(req, res)
{
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
            res.status(201);
            res.end();
        }
    });
});

app.listen(PORT, () => {
    console.log("Express started on http://localhost:"+PORT+"; press Ctrl-C to terminate.");
});