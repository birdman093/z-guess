import {config} from '../config/_config.js';
import {insert} from '../utility/_post.js';
import {GetZillowPrice} from '../utility/_zillowPrice.js';
import connection from '../middlewares/_dbSetup.js';
import errorMessage from '../utility/_error.js';

import express from 'express';
import axios from 'axios';
import { userExists, propertyColumns, sendPropertyData } from '../utility/_get.js';

// GET 1 RANDOM property by user -- previously used by spotify microservice project
// /properties/random/:userName
export default function(req, res)
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

    connection.query(qString, [req.query.userName],function(error, results, fields){
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
};