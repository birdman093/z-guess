import {config} from '../config/_config.js';
import pkg from 'pg';

const {Pool} = pkg;

function dbSetup() {
    const pool = new Pool({
        connectionString: config.db.connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting:', err.stack);
        } else {
            console.log('Connected to Postgres, server time:', res.rows[0].now);
        }
    });

    return pool;

    /*
    var connection = mysql.createConnection(config.db.connectionString);

    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else {
            console.log('connected as id ' + connection.threadId);
        }
    });
    return connection
    */
}

const connection = dbSetup();

export default connection;
