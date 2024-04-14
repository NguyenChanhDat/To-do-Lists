const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mysql = require("mysql");
const con = mysql.createPool({
  host: "localhost",
  user: "sqluser",
  password: "dat20112011",
  database: "todolistdb",
});
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log(`App listening at port 8080`);
});
app.post("/addTodo", function (req, res) {
  console.log("req.body.date: " + req.body.date);
  console.log("todo: " + req.body.msg);
  let todo = req.body.msg;
  con.getConnection(function (err, connection) {
    if (err) throw err;
    console.log("Connected!");
    // Use '?' as a placeholder for values
    connection.query(
      "INSERT INTO todolisttable (todo) VALUES (?)",
      [todo], // Pass the todo value as an array
      function (err, result) {
        connection.release(); // Release the connection
        if (err) throw err;
        console.log("Data added to todolisttable in mySQL server!");
        res.redirect("http://localhost:8081");
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
