import {getOne} from '../../utility/_get.js';
import {setScore} from '../../utility/_post.js';
import connection from '../../middlewares/_dbSetup.js';

// /user/guess
// User Guess for property
export default function(req, res)
{
    setScore(req, res, connection);
};