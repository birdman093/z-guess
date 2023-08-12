import {config} from '../config/config.js';
import GetQuery from './utility/get.js';
import {Insert, Insert_UpdateScore} from './utility/routesPostInsertUpdate.js';
import {GetZillowPrice} from './utility/zillowPrice.js';
import connection from '../middlewares/dbSetup.js';

import express, { response } from 'express';
import axios from 'axios';

const spotifyRoutes = express.Router();

// Random User Property Link MicroService:  Used by Spotify Microservice
spotifyRoutes.get('/spotifyproperties/:userName', function(req, res)
{
    //Send link to spotify playlist microservice
    var qString = `SELECT Properties.Url, Properties.Image FROM Accounts LEFT JOIN 
    AccountsToProperties ON Accounts.UserName = ` +
    `AccountsToProperties.UserName LEFT JOIN Properties ON AccountsToProperties.PropertyID = ` +
    `Properties.PropertyID WHERE Accounts.UserName = ? ORDER BY RAND () LIMIT 1`;

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

export default spotifyRoutes;