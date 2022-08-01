import express, { response } from 'express';
const PORT = 6363;
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import config from './config';

//ERROR CODES
//404 -- PAGE NOT FOUND -- DB NOT WORKING DURING SELECTION
//405 -- ERROR DURING DELETION
//406 -- ERROR DURING PUT
//407 -- ERROR DURING INSERT
//410 -- INSERT/ PUT -- DUPLICATE ENTRY
//415 -- ZILLOW API FAILURE
//425 -- PUT ERROR -- NO update has been made


// Connect to DB
var connection = mysql.createConnection(config.db);

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// Set up 
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//  LazyMan's Password Validation  --> future to use hashing approach
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

app.get('/GET/spotifyproperties/:userName', function(req, res)
{
    //Send link to spotify playlist microservice
    var qString = `SELECT Properties.Url FROM Logins LEFT JOIN LoginsToProperties ON Logins.UserName = ` +
    `LoginsToProperties.UserName LEFT JOIN Properties ON LoginsToProperties.PropertyID = ` +
    `Properties.PropertyID WHERE Logins.UserName = ? ORDER BY RAND () LIMIT 1`;

    connection.query(qString, [req.params.userName],function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404).end();
        }
        console.log(results[0].Url)
        if (results[0].Url !== null) {
            res.json(results[0])
        } else {
            res.json({Url: "No Properties Found"});
        }
        res.status(201).end();
        //Url to access
    });                                                 
});

app.get('/GET/properties/:userName', function(req, res)
{
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
    // modify RAPID API options to include property URL
    const options = config.rapidAPI
    options.params.property_url = req.body.url;

    const response = axios.request(options);
    response.then((response) => {
        var inserts = [response.data.zpid, req.body.name, response.data.address.streetAddress, response.data.address.city, 
            response.data.address.state, response.data.address.zipcode, response.data.price, response.data.zestimate, null, req.body.url];
        var sql = "INSERT INTO `Properties`(`PropertyID`, `Name`, `StreetAddress`, `City`, `State`," +
         "`ZipCode`, `ListPrice`, `Zestimate`, `SellPrice`, `Url`)" + " VALUES (?,?,?,?,?,?,?,?,?,?)";
        console.log(inserts)
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
                var sql2 = "INSERT INTO `LoginsToProperties`(`UserName`, `PropertyID`, `Guess`) VALUES (?, ?, ?)";
                var inserts2 = [req.body.userName, response.data.zpid, null];
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
        
    })
    .catch((error) => {
        console.log(error)
        res.status(415);
        res.write(JSON.stringify("ERROR WITH ZILLOW API"));
        res.end();
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

// Testing out Beat the Zestimate End of Microservice
app.post('/playlistgenerator', function(req, res)
{
    var NumSongsSent = req.body.tracks.length;
    res.json({link:NumSongsSent});
    res.end()   
});

app.listen(PORT, () => {
    console.log("Express started on http://localhost:"+PORT+"; press Ctrl-C to terminate.");
});