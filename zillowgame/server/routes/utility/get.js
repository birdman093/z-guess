export default function GetQuery(connection, sql, inserts, req, res) {
    connection.query(sql, inserts, function(error, results, fields){
        if(error){
            console.error("DB Error:", error);
            return res.status(400).json({ error: errorMessage("DB-Select") });
        }
        return res.status(201).json(results);
    });
};
