import {config} from '../config/config.js';
import GetQuery from './utility/get.js';
import {Insert, Insert_UpdateScore} from './utility/post.js';
import {GetZillowPrice} from './utility/zillowPrice.js';
import connection from '../middlewares/dbSetup.js';

import express, { response } from 'express';
import axios from 'axios';

const userRoutes = express.Router();

//  User Account Login -- LazyMan Password Validation against DB Table
userRoutes.post('/user', function(req, res)
{
    var sql = `SELECT UserName, FirstName, LastName, Score FROM Accounts 
    WHERE UserName = $1 AND Password = $2`;
    var inserts = [req.body.userName, req.body.password]
    GetQuery(connection, sql, inserts, req, res);                                            
});

//  User Score (No Password needed currently)
userRoutes.post('/user/score', function(req, res)
{
    var sql = `SELECT Score FROM Accounts WHERE UserName = $1`;
    var inserts = [req.body.userName]
    GetQuery(connection, sql, inserts, req, res);                                            
});

// User Guess for property
userRoutes.post('/user/guess', function(req, res)
{
    Insert_UpdateScore(req, res, connection);
});

export default userRoutes;