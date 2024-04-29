require("dotenv").config({ path: "../local.env" });
const env = require("@ltv/env");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mysql = require("mysql");

const con = mysql.createPool({
  host: env("DB_HOST", "localhost"),
  user: env("DB_USER", "sqluser"),
  password: env("DB_PASSWORD", "dat20112011"),
  database: env("DB_NAME", "todolistdb"),
});
app.use(bodyParser.urlencoded({ extended: true }));

app.listen((port = env.int("SERVERS_PORT", 8088)), () => {
  console.log(`App listening at port ` + port);
});
app.post("/addTodo", function (req, res) {
  console.log("todo: " + req.body.msg);
  console.log("todo's date: " + req.body.date);
  let todo = req.body.msg;
  let date = req.body.date;
  con.getConnection(function (err, connection) {
    if (err) throw err;
    console.log("Connected!");
    // Use '?' as a placeholder for values
    connection.query(
      "INSERT INTO todolisttable (todo, date_time) VALUES (?, ?)",
      [todo, date], // Pass both todo and date values as an array
      function (err, result) {
        if (err) {
          connection.release(); // Release the connection if there's an error
          throw err;
        }
        console.log("Data added to todolisttable in mySQL server!");

        // Now that the data is inserted, let's sort the rows by date_time
        connection.query(
          "SELECT * FROM todolisttable ORDER BY date_time ASC",
          function (err, result) {
            connection.release(); // Release the connection
            if (err) throw err;
            console.log("Rows sorted by date_time:");
            console.log(result); // Display sorted rows
            res.redirect("http://localhost:8081");
          }
        );
      }
    );
  });
});

app.get("/deleteTodo", function (req, res) {
  let todo = req.query.todo;
  con.getConnection(function (err, connection) {
    if (err) throw err;
    console.log("Connected!");
    // Use '?' as a placeholder for values
    connection.query(
      "DELETE FROM todolisttable WHERE todo= ?",
      [todo],
      function (err, result) {
        connection.release(); // Release the connection
        if (err) throw err;
        console.log("Data deleted from todolisttable in mySQL server!");
        res.redirect("http://localhost:8081");
      }
    );
  });
});
