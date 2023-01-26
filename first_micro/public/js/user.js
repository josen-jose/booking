window.addEventListener("DOMContentLoaded", (event) => {
  let user = document.getElementById("incom").innerHTML;

  user = JSON.parse(user);
  dellist = [];
  newlist = [];
  ////////////// LISTING USERS ///////////////////

  for (i = 0; i < user.length; i++) {
    document.getElementById("user" + i).parentNode.id = user[i]._id;
    document.getElementById("user" + i).innerHTML =
      "<h8>" + user[i].email + "</h8>";
    document.getElementById("car" + i).innerHTML =
      "<h8>" + user[i].password + "</h8>";
    document.getElementById("car" + i).setAttribute("contenteditable", "true");
  }

  //////////// ASSIGNING CLICK ACTION TO DELETE BUTTON /////////////
  var canElems = document.querySelectorAll(".cancel");

  for (var i = 0; i < canElems.length; i++) {
    canElems[i].addEventListener("click", del);
  }

  function del(e) {
    if (confirm("Do you really want to delete this user?")) {
      rem = e.target.parentNode.parentNode.id;
      dellist.push({ id: rem });
      row = e.target.parentNode.parentNode.children[0].innerHTML;
      document.getElementById("table").deleteRow(row);
      // document.getElementById(rem).setAttribute("hidden", true);
      document.getElementById("del_list").value = JSON.stringify(dellist);
    }
  }

  //////////// ASSIGNING CLICK ACTION TO ADD BUTTON /////////////
  var newElems = document.querySelectorAll(".new");
  console.log(newElems);
  for (var i = 0; i < newElems.length; i++) {
    newElems[i].addEventListener("click", newli);
  }

  function newli(e) {
    if (
      e.target.parentNode.previousElementSibling.previousElementSibling
        .innerText
    ){
      email =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .innerText;
    newcar = e.target.parentNode.previousElementSibling.innerText;
    console.log(newcar, email);

    let table = document.getElementById("tableBody");

    // Create row element
    let row = document.createElement("tr");

    // Create cells
    let c1 = document.createElement("td");
    let c2 = document.createElement("td");
    let c3 = document.createElement("td");
    let c4 = document.createElement("td");

    // Insert data to cells
    c1.innerText = "";
    c2.innerHTML = "<em><strong>Please update to add user</strong></em>";
    c3.innerText = "";
    c4.innerHTML = "";

    // Append cells to row
    row.appendChild(c1);
    row.appendChild(c2);
    row.appendChild(c3);
    row.appendChild(c4);

    // Append row to table body
    table.appendChild(row);
    }
    else{
      alert('Missing User or Car Details');
    }
  }

  //////////// SUBMIT BUTTON  /////////////

  document.getElementById("submit").addEventListener("click", function () {
    count =
      document.getElementsByClassName("table")[0].tBodies[0].children.length;
    save = [];

    for (i = 0; i < count; i++) {
      id =
        document.getElementsByClassName("table")[0].tBodies[0].children[i].id;
      email =
        document.getElementsByClassName("table")[0].tBodies[0].children[i]
          .children[1].innerText;
      car =
        document.getElementsByClassName("table")[0].tBodies[0].children[i]
          .children[2].innerText;

      if (car) {
        save.push({ ids: id, email: email, pass: car });
      }
    }
    data = JSON.stringify(save);
    document.getElementById("del_list").value = JSON.stringify(dellist);
    document.getElementById("up_list").value = data;
  });
});
