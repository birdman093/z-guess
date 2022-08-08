export default function GetQuery(connection, sql, inserts, req, res) {
        connection.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(404).end();
            }
            res.json(results);
            res.status(201).end();
    })
    return;
};