var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // Ensure you're using JSON body parsing

var mysql = require('mysql');

// Create a connection pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost', // Use environment variable or fallback to localhost
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'demo'
});

app.get("/", function (request, response) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            return response.status(500).send("Database connection error");
        }
        
        console.log("Database connected ...");
        
        const sql = "SELECT * FROM employee";
        connection.query(sql, function (err, result) {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error executing query:', err);
                return response.status(500).send("Query execution error");
            }
            response.send(result);
        });
    });
});

app.get("/hello", function (request, response) {
    var mydate = new Date();
    response.send("Hello world...." + mydate.toDateString());
});

app.post("/hi", function (request, response) {
    var data = request.body;
    response.send(data);
});

app.put("/update", function (request, response) {
    response.send("Hello world...using PUT");
});

app.delete("/remove", function (request, response) {
    response.send("Hello world...using DELETE");
});

app.listen(8787, () => {
    console.log("Server is running on port 8787");
});