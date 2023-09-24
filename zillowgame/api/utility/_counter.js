import { SQLError, CounterError } from "./_post.js";

export default async function counterCheck(res, connection) {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const yearmonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g., "2023-09"

        let queryString = "SELECT counter FROM apicounter WHERE yearmonth = $1";
        let queryInserts = [yearmonth];

        connection.query(queryString, queryInserts, (error, results) => {
            if (error) {
                SQLError(error, res);
                console.error("DB Error:", error);
                reject(error);
            }

            if (results && results.rows && results.rows.length) {
                // Entry exists for current month and year
                const counter = results.rows[0].counter;

                if (counter > 45) {
                    CounterError(res);
                    console.error("Counter Error:", error);
                    reject(error);
                }

                let updateString = "UPDATE apicounter SET counter = counter + 1 WHERE yearmonth = $1";
                connection.query(updateString, [yearmonth], (updateError) => {
                    if (updateError) {
                        SQLError(updateError);
                        console.error("Counter Error:", error);
                        reject(error);
                    }
                    return resolve();
                });
            } else {
                // Entry doesn't exist for current month and year
                let insertString = "INSERT INTO apicounter (yearmonth, counter) VALUES ($1, $2)";
                connection.query(insertString, [yearmonth, 1], (insertError) => {
                    if (insertError) {
                        SQLError(insertError);
                        console.error("Counter Error:", error);
                        reject(error);
                    }
                    return resolve();
                });
            }
        });
    });
}
