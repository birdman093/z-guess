// Get an instance of mysql we can use in the app
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_sheajon',
    password: '4132',
    database: 'cs340_sheajon'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

module.exports.connection = connection;