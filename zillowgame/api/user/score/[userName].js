import {getOne} from '../../utility/_get.js';
import {setScore} from '../../utility/_post.js';
import connection from '../../middlewares/_dbSetup.js';

//  /user/score/:userName 
//  User Score (No Password needed currently)
export default function(req, res)
{
    var sql = `SELECT Score FROM Accounts WHERE UserName = $1;`;
    var inserts = [req.params.userName]
    getOne(connection, sql, inserts, req, res);                                            
};
