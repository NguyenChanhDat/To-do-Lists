let http = require("http");
let fs = require("fs");

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
  })
  .listen(8080);
