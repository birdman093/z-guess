import {config} from '../config/_config.js';
import {insert} from '../utility/_post.js';
import {GetZillowPrice} from '../utility/_zillowPrice.js';
import connection from '../middlewares/_dbSetup.js';
import errorMessage from '../utility/_error.js';

import express from 'express';
import axios from 'axios';
import { userExists, propertyColumns, sendPropertyData } from '../utility/_get.js';

// GET ALL properties by user
// /properties/:userName
export default function(req, res)
{
    console.log(req);
    var qString = `SELECT
    ${propertyColumns.join(',\n    ')}
    FROM
        Accounts 
    INNER JOIN 
        AccountsToProperties ON Accounts.UserName = AccountsToProperties.UserName 
    INNER JOIN 
        Properties ON AccountsToProperties.PropertyID = Properties.PropertyID 
    WHERE 
        Accounts.UserName = $1`;

    connection.query(qString, [req.query.userName],function(error, results, fields){
        if(error){
            res.write(errorMessage("DB-Select"));
            res.status(400).end();
        }
        res.json(results.rows);
        res.status(201).end();
    });                                                 
};