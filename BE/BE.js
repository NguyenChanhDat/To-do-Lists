let http = require("http");
let fs = require("fs");
let mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "dat20112011",
});
http
  .createServer(function (req, res) {
    if (req.method == "POST") {
      var body = "";
      req.on("data", function (data) {
        body += data;
        console.log("Partial body: " + body);
      });
      req.on("end", function () {
        console.log("Body: " + body);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("post received");
      });
    }
    con.connect(function (err) {});
  })
  .listen(8080);
