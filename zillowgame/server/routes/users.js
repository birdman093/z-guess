import {config} from '../config/config.js';
import GetQuery from './utility/get.js';
import {Insert, Insert_UpdateScore} from './utility/routesPostInsertUpdate.js';
import {GetZillowPrice} from './utility/zillowPrice.js';
import connection from '../middlewares/dbSetup.js';

import express, { response } from 'express';
import axios from 'axios';

const userRoutes = express.Router();

//  Account Login: LazyMan's Password Validation. Validates userName and Password against DB
userRoutes.post('/user', function(req, res)
{
    var sql = `SELECT UserName, FirstName, LastName, Score FROM Accounts 
    WHERE UserName = $1 AND Password = $2`;
    var inserts = [req.body.userName, req.body.password]
    GetQuery(connection, sql, inserts, req, res);                                            
});

//  Get Score for an individual user
userRoutes.post('/user/score', function(req, res)
{
    var sql = `SELECT Score FROM Accounts WHERE UserName = ?`;
    var inserts = [req.body.userName]
    GetQuery(connection, sql, inserts, req, res);                                            
});

userRoutes.post('/guess', function(req, res)
{
    Insert_UpdateScore(req, res, connection);
});

export default userRoutes;