import {config} from '../config/config.js';
import GetQuery from './utility/get.js';
import {Insert, Insert_UpdateScore} from './utility/post.js';
import {GetZillowPrice} from './utility/zillowPrice.js';
import connection from '../middlewares/dbSetup.js';
import errorMessage from './utility/error.js';

import express, { response } from 'express';

const propertiesRoutes = express.Router();

// GET ALL properties by user
propertiesRoutes.get('/properties/:userName', function(req, res)
{
    var qString = `SELECT * FROM Accounts LEFT JOIN AccountsToProperties ON Accounts.UserName = ` +
    `AccountsToProperties.UserName LEFT JOIN Properties ON AccountsToProperties.PropertyID = ` +
    `Properties.PropertyID WHERE Accounts.UserName = $1`;

    connection.query(qString, [req.params.userName],function(error, results, fields){
        if(error){
            res.write(errorMessage("DB-Select"));
            res.status(400).end();
        }
        res.json(results);
        res.status(201).end();
    });                                                 
});

// GET 1 RANDOM property by user -- previously used by spotify microservice project
propertiesRoutes.get('/properties/random/:userName', function(req, res)
{
    //Send link to spotify playlist microservice
    var qString = `SELECT Properties.Url, Properties.Image FROM Accounts LEFT JOIN 
    AccountsToProperties ON Accounts.UserName = ` +
    `AccountsToProperties.UserName LEFT JOIN Properties ON AccountsToProperties.PropertyID = ` +
    `Properties.PropertyID WHERE Accounts.UserName = $1 ORDER BY RAND () LIMIT 1`;

    connection.query(qString, [req.params.userName],function(error, results, fields){
        if(error){
            res.write(errorMessage("DB-Select"));
            res.status(400).end();
        }
        if (results[0].Url !== null) {
            res.json(results[0]);
        } else {
            res.json({Url: "No Properties Found"});
        }
        res.status(201).end();
    });                                                 
});

// POST new property
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
            var sql = `INSERT INTO "Properties"("PropertyID", "Name", "StreetAddress", "City", "State", 
            "ZipCode", "ListPrice", "Zestimate", "SellPrice", "Url", "Image") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
        connection.query(sql,inserts,function(error, results, fields){
            if(error && error.code !== "ER_DUP_ENTRY"){
                res.status(400);
                res.write(errorMessage("Duplicate"));
                res.end();
            }else{
                var sql2 = `INSERT INTO "AccountsToProperties"("UserName", "PropertyID", "Guess") VALUES ($1, $2, $3)`;

                var inserts2 = [req.body.userName, response.data.zpid, null];
                Insert(req, res, sql2, inserts2, connection);
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