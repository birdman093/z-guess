// Get an instance of mysql we can use in the app
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs361_featheru',
    password: '9999',
    database: 'cs361_featheru'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

module.exports.connection = connection;