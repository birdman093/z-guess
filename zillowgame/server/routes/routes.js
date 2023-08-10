import {config} from '../config/config.js';
import GetQuery from './Get.js';
import {Insert, Insert_UpdateScore} from './routes_Post_Insert_Update.js';
import {GetZillowPrice} from './ZillowPrice.js';

import express, { response } from 'express';
import axios from 'axios';

const routes = express.Router();

//ERROR CODES
//404 -- PAGE NOT FOUND -- DB NOT WORKING DURING SELECTION
//405 -- ERROR DURING DELETION
//406 -- ERROR DURING PUT
//407 -- ERROR DURING INSERT
//410 -- INSERT/ PUT -- DUPLICATE ENTRY
//415 -- ZILLOW API FAILURE
//425 -- PUT ERROR -- NO update has been made

//  Account Login: LazyMan's Password Validation. Validates userName and Password against DB
routes.post('/GET/user', function(req, res)
{
    var sql = `SELECT UserName, FirstName, LastName, Score FROM Logins WHERE UserName = ? AND Password = ?`;
    var inserts = [req.body.userName, req.body.password]
    GetQuery(connection, sql, inserts, req, res);                                            
});

//  Get Score for an individual user
routes.post('/GET/user/score', function(req, res)
{
    var sql = `SELECT Score FROM Logins WHERE UserName = ?`;
    var inserts = [req.body.userName]
    GetQuery(connection, sql, inserts, req, res);                                            
});

// Random User Property Link MicroService:  Used by Spotify Microservice
routes.get('/GET/spotifyproperties/:userName', function(req, res)
{
    //Send link to spotify playlist microservice
    var qString = `SELECT Properties.Url, Properties.Image FROM Logins LEFT JOIN LoginsToProperties ON Logins.UserName = ` +
    `LoginsToProperties.UserName LEFT JOIN Properties ON LoginsToProperties.PropertyID = ` +
    `Properties.PropertyID WHERE Logins.UserName = ? ORDER BY RAND () LIMIT 1`;

    connection.query(qString, [req.params.userName],function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(404).end();
        }
        if (results[0].Url !== null) {
            res.json(results[0]);
        } else {
            res.json({Url: "No Properties Found"});
        }
        res.status(201).end();
    });                                                 
});

// Returns all properties in db for user
routes.get('/GET/properties/:userName', function(req, res)
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

// Add new property to DB
routes.post('/POST/properties', function(req, res)
{
    // RAPID API options set to search for input property URL (partially validated on front end)
    const options = config.rapidAPI
    options.params.property_url = req.body.url;

    const response = axios.request(options);
    response.then((response) => {
        let [listPrice, sellPrice] = GetZillowPrice(response.data.priceHistory);
        var inserts = [response.data.zpid, req.body.name, response.data.address.streetAddress, response.data.address.city, 
            response.data.address.state, response.data.address.zipcode, listPrice, response.data.zestimate, sellPrice, 
            req.body.url, response.data.imgSrc];
        var sql = "INSERT INTO `Properties`(`PropertyID`, `Name`, `StreetAddress`, `City`, `State`," +
         "`ZipCode`, `ListPrice`, `Zestimate`, `SellPrice`, `Url`,`Image`)" + " VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(sql,inserts,function(error, results, fields){
            if(error && error.code !== "ER_DUP_ENTRY"){
                res.status(407);
                res.write(JSON.stringify(error));
                res.end();
            }else{
                var sql2 = "INSERT INTO `LoginsToProperties`(`UserName`, `PropertyID`, `Guess`) VALUES (?, ?, ?)";
                var inserts2 = [req.body.userName, response.data.zpid, null];
                Insert(req, res, sql2, inserts2, connection);
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

routes.post('/POST/guess', function(req, res)
{
    Insert_UpdateScore(req, res, connection);
});

export default routes;