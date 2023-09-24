import {config} from '../config/_config.js';
import {insert} from '../utility/_post.js';
import {GetZillowPrice} from '../utility/_zillowPrice.js';
import connection from '../middlewares/_dbSetup.js';
import errorMessage from '../utility/_error.js';

import express from 'express';
import axios from 'axios';
import { userExists, propertyColumns, sendPropertyData } from '../utility/_get.js';

// POST new property
// /properties
export default async function(req, res)
{
    // lazy user validation
    if (!req.body.hasOwnProperty('userName')) 
    {
        res.status(403).send(errorMessage("NoAccount"));
        return;
    }

    const exists = await userExists(connection, [req.body.userName]);

    if (!exists) {
        res.status(403).send(errorMessage("NoAccount"));
        return;
    }

    // RAPID API Zillow.com
    const options = config.rapidAPI
    options.params.property_url = req.body.url;
    const response = axios.request(options);

    response.then(async (response) => {
        let [listPrice, sellPrice] = GetZillowPrice(response.data.priceHistory);
        var inserts = [String(response.data.zpid), response.data.address.streetAddress, 
            response.data.address.city, response.data.address.state, response.data.address.zipcode, 
            listPrice, response.data.zestimate, sellPrice, req.body.url, response.data.imgSrc];
            var sql = `INSERT INTO 
            Properties(PropertyID, StreetAddress, City, State, 
            ZipCode, ListPrice, Zestimate, SellPrice, Url, Image) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        connection.query(sql,inserts, async function(error, results, fields){
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
                var sql2 = `INSERT INTO AccountsToProperties(UserName, PropertyID, Name, Description, Guess) 
                VALUES ($1, $2, $3, $4, $5)`;
                var inserts2 = [req.body.userName, String(response.data.zpid), req.body.name, null, null];
                insert(req, res, sql2, inserts2, connection)
                .then(() => sendPropertyData(connection, res, req.body.userName, String(response.data.zpid)))          
            }
        });
        
    })
    .catch((error) => {
        console.log(error)
        res.status(400);
        res.write(errorMessage("Zillow"));
        res.end();
    });
};