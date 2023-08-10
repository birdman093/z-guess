import mysql from 'mysql';
import {config} from '../config/config.js';

function dbSetup() {
    return null;
    //TODO: Set up new database
    var connection = mysql.createConnection(config.db);

    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else {
            console.log('connected as id ' + connection.threadId);
        }
    });
    return connection
}

const dbConnection = dbSetup();

export default dbConnection;
