import mysql from 'mysql';
import config from './config.js';

export default function dbSetup() {
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