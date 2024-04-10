const express = require("express");
const http = require("http");
const mysql = require("mysql");
const app = express();
const con = mysql.createPool({
  host: "localhost",
  user: "sqluser",
  password: "dat20112011",
  database: "todolistdb",
});
app
  .post("/", (req, res) => {
    let body = "";
    req.on("data", function (data) {
      body += data;
      console.log("Partial body: " + body);
    });
    req.on("end", function () {
      console.log("Body: " + body);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("post received");
    });
    con.getConnection(function (err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(
        "INSERT INTO todolisttable (todo) VALUES (" + body + ")",
        function (err, result) {
          if (err) throw err;
          console.log("Data added to todolisttable!");
        }
      );
    });
  })
  .listen(8080);
