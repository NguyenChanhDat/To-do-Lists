let toDoText = document.getElementById("inputSubmit").;

function insertData(toDo) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080");
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
insertData(toDoText);
console.log(toDoText);
