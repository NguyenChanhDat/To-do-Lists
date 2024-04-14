const express = require("express");
const app = express();
const http = require("http");
const mysql = require("mysql");
const con = mysql.createPool({
  host: "localhost",
  user: "sqluser",
  password: "dat20112011",
  database: "todolistdb",
});
// Setting EJS as the view engine
app.set("view engine", "ejs");

//Server is listening on port 8082
app.listen(8081, () => {
  console.log(`App listening at port 8081`);
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
