import {getOne} from './utility/get.js';
import {setScore} from './utility/post.js';
import connection from '../middlewares/dbSetup.js';

import express, { response } from 'express';

const userRoutes = express.Router();

//  User Account Login -- LazyMan Password Validation against DB Table
userRoutes.post('/user', function(req, res)
{
    var sql = `SELECT UserName, FirstName, LastName, Score FROM Accounts 
    WHERE UserName = $1 AND Password = $2`;
    var inserts = [req.body.userName, req.body.password]
    getOne(connection, sql, inserts, req, res);                                            
});

//  User Score (No Password needed currently)
userRoutes.get('/user/score/:userName', function(req, res)
{
    var sql = `SELECT Score FROM Accounts WHERE UserName = $1;`;
    var inserts = [req.params.userName]
    getOne(connection, sql, inserts, req, res);                                            
});

// User Guess for property
userRoutes.post('/user/guess', function(req, res)
{
    setScore(req, res, connection);
});

export default userRoutes;