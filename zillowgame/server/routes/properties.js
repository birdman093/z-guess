import {config} from '../config/config.js';
import GetQuery from './utility/get.js';
import {Insert, Insert_UpdateScore} from './utility/routesPostInsertUpdate.js';
import {GetZillowPrice} from './utility/zillowPrice.js';
import connection from '../middlewares/dbSetup.js';

import express, { response } from 'express';
import axios from 'axios';

const propertiesRoutes = express.Router();

//ERROR CODES
//404 -- PAGE NOT FOUND -- DB NOT WORKING DURING SELECTION
//405 -- ERROR DURING DELETION
//406 -- ERROR DURING PUT
//407 -- ERROR DURING INSERT
//410 -- INSERT/ PUT -- DUPLICATE ENTRY
//415 -- ZILLOW API FAILURE
//425 -- PUT ERROR -- NO update has been made

// Returns all properties in db for user
propertiesRoutes.get('/properties/:userName', function(req, res)
{
    var qString = `SELECT * FROM Accounts LEFT JOIN AccountsToProperties ON Accounts.UserName = ` +
    `AccountsToProperties.UserName LEFT JOIN Properties ON AccountsToProperties.PropertyID = ` +
    `Properties.PropertyID WHERE Accounts.UserName = ?`;

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
propertiesRoutes.post('/properties', function(req, res)
{
    // RAPID API options set to search for input property URL (partially validated on front end)
    const options = config.rapidAPI
    options.params.property_url = req.body.url;

    const response = axios.request(options);
    response.then((response) => {
        let [listPrice, sellPrice] = GetZillowPrice(response.data.priceHistory);
        var inserts = [response.data.zpid, req.body.name, response.data.address.streetAddress, 
            response.data.address.city, response.data.address.state, response.data.address.zipcode, 
            listPrice, response.data.zestimate, sellPrice, req.body.url, response.data.imgSrc];
        var sql = "INSERT INTO `Properties`(`PropertyID`, `Name`, `StreetAddress`, `City`, `State`," +
         "`ZipCode`, `ListPrice`, `Zestimate`, `SellPrice`, `Url`,`Image`)" + " VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(sql,inserts,function(error, results, fields){
            if(error && error.code !== "ER_DUP_ENTRY"){
                res.status(407);
                res.write(JSON.stringify(error));
                res.end();
            }else{
                var sql2 = "INSERT INTO `AccountsToProperties`(`UserName`, `PropertyID`, `Guess`) VALUES (?, ?, ?)";
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

export default propertiesRoutes;