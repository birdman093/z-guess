import {getOne} from '../utility/_get.js';
import {setScore} from '../utility/_post.js';
import connection from '../middlewares/_dbSetup.js';

import express, { response } from 'express';

//  User Account Login -- LazyMan Password Validation against DB Table
//  /user
export default function(req, res)
{
    var sql = `SELECT UserName, FirstName, LastName, Score FROM Accounts 
    WHERE UserName = $1 AND Password = $2`;
    var inserts = [req.body.userName, req.body.password]
    getOne(connection, sql, inserts, req, res);                                            
};