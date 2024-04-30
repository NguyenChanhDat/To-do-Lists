require("dotenv").config({ path: "../local.env" });
const env = require("@ltv/env");
const express = require("express");
const app = express();
const mysql = require("mysql");

const bodyParser = require("body-parser");
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createPool({
  host: env("DB_HOST", "localhost"),
  user: env("DB_USER", "sqluser"),
  password: env("DB_PASSWORD", "userpassword"),
  database: env("DB_NAME", "todolistdb"),
});
// Setting EJS as the view engine
app.set("view engine", "ejs");

//Server is listening on port 8080
app.listen((port = env.int("SERVERS_PORT", 8088)), () => {
  console.log(`App listening at port ` + port);
});
app.use(express.static("public"));

//render main page
app.get("/", (req, res) => {
  con.getConnection(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM todolisttable ORDER BY date_time ASC",
      function (err, result, fields) {
        if (err) throw err;
        let toDo = [];
        for (let i = 0; i < result.length; i++) {
          toDo.push({
            toDoMission: result[i].todo,
            toDoDate: String(result[i].date_time).slice(0, 15),
          });
        }
        res.render("pages/index", { toDo });
      }
    );
  });
});

//handle add Todo Feature
app.post("/addTodo", function (req, res) {
  console.log(req);
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
            res.redirect("/");
          }
        );
      }
    );
  });
});

//handle delete todo feature
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
        res.redirect("/");
      }
    );
  });
});
module.exports = app;
