require("dotenv").config({ path: "../local.env" });
const env = require("@ltv/env");

const express = require("express");
const app = express();
const http = require("http");
const mysql = require("mysql");
const con = mysql.createPool({
  host: env("DB_HOST", "localhost"),
  user: env("DB_USER", "sqluser"),
  password: env("DB_PASSWORD", "dat20112011"),
  database: env("DB_NAME", "todolistdb"),
});
// Setting EJS as the view engine
app.set("view engine", "ejs");

//Server is listening on port 8082
app.listen(port=env.int("CLIENTS_PORT", 8089), () => {
  console.log(`App listening at port`+port);
});
app.use(express.static("public"));
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
