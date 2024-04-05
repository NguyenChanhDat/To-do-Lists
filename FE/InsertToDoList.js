let mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "sqluser",
  password: "dat20112011",
});
function insertData() {
  let toDo = document.getElementById("msg").value;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const toDoJSONStringfy = JSON.stringify(toDo);
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 201) {
      console.log(JSON.parse(xhr.responseText));
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
  xhr.send(toDoJSONStringfy);
}
