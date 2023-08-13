import {config} from '../config/config.js';
import {insert} from './utility/post.js';
import {GetZillowPrice} from './utility/zillowPrice.js';
import connection from '../middlewares/dbSetup.js';
import errorMessage from './utility/error.js';

import express from 'express';
import axios from 'axios';
import { userExists } from './utility/get.js';

const propertiesRoutes = express.Router();

// GET ALL properties by user
propertiesRoutes.get('/properties/:userName', function(req, res)
{
    var qString = `SELECT
    AccountsToProperties.PropertyID,
    AccountsToProperties.Guess,
    AccountsToProperties.Name,
    AccountsToProperties.Description,
    Properties.StreetAddress,
    Properties.City,
    Properties.State,
    Properties.ZipCode,
    Properties.ListPrice,
    Properties.Zestimate,
    Properties.SellPrice,
    Properties.Url,
    Properties.Image 
    FROM 
        Accounts 
    INNER JOIN 
        AccountsToProperties ON Accounts.UserName = AccountsToProperties.UserName 
    INNER JOIN 
        Properties ON AccountsToProperties.PropertyID = Properties.PropertyID 
    WHERE 
        Accounts.UserName = $1`;

    connection.query(qString, [req.params.userName],function(error, results, fields){
        if(error){
            res.write(errorMessage("DB-Select"));
            res.status(400).end();
        }
        res.json(results.rows);
        res.status(201).end();
    });                                                 
});

// GET 1 RANDOM property by user -- previously used by spotify microservice project
propertiesRoutes.get('/properties/random/:userName', function(req, res)
{
    var qString = `SELECT
    Properties.Url,
    Properties.Image 
    FROM 
        Accounts 
    INNER JOIN 
        AccountsToProperties ON Accounts.UserName = AccountsToProperties.UserName 
    INNER JOIN 
        Properties ON AccountsToProperties.PropertyID = Properties.PropertyID 
    WHERE 
        Accounts.UserName = $1
    ORDER BY RANDOM () LIMIT 1`;

    connection.query(qString, [req.params.userName],function(error, results, fields){
        if(error){
            res.write(errorMessage("DB-Select"));
            res.status(400).end();
        }

        if (results.rows.length > 0 && results.rows[0].Url !== null) {
            res.json(results[0]);
        } else {
            res.json({Url: "No Properties Found", "Image": "No Image Found"});
        }
        res.status(201).end();
    });                                                 
});

// POST new property
propertiesRoutes.post('/properties', async function(req, res)
{
    // lazy user validation
    if (!req.body.hasOwnProperty('userName') || 
        !req.body.hasOwnProperty('password')) 
    {
        res.status(403).send(errorMessage("NoAccount"));
        return;
    }

    const exists = await userExists(connection, [req.body.userName, req.body.password]);

    if (!exists) {
        res.status(403).send(errorMessage("NoAccount"));
        return;
    }

    // RAPID API Zillow.com
    const options = config.rapidAPI
    options.params.property_url = req.body.url;
    const response = axios.request(options);
    console.log(response)

    response.then((response) => {
        let [listPrice, sellPrice] = GetZillowPrice(response.data.priceHistory);
        var inserts = [String(response.data.zpid), response.data.address.streetAddress, 
            response.data.address.city, response.data.address.state, response.data.address.zipcode, 
            listPrice, response.data.zestimate, sellPrice, req.body.url, response.data.imgSrc];
            var sql = `INSERT INTO 
            Properties(PropertyID, StreetAddress, City, State, 
            ZipCode, ListPrice, Zestimate, SellPrice, Url, Image) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        connection.query(sql,inserts,function(error, results, fields){
            if(error && error.code === "ER_DUP_ENTRY"){
                res.status(400);
                res.write(errorMessage("Duplicate"));
                res.end();
            }
            else if (error)
            {
                console.log(error);
                res.status(400);
                res.write(errorMessage("DB-Post"));
                res.end();
            }
            else{
                console.log("next-round");
                var sql2 = `INSERT INTO AccountsToProperties(UserName, PropertyID, Name, Description, Guess) 
                VALUES ($1, $2, $3, $4, $5)`;
                var inserts2 = [req.body.userName, String(response.data.zpid), null, null, null];
                insert(req, res, sql2, inserts2, connection);
            }
        });
        
    })
    .catch((error) => {
        console.log(error)
        res.status(400);
        res.write(errorMessage("Zillow"));
        res.end();
    });
});

export default propertiesRoutes;