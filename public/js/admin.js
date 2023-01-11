window.addEventListener("DOMContentLoaded", (event) => {
  let booking = document.getElementById("incom").innerHTML;
  var dates = [];
  booking = JSON.parse(booking);
  for (i = 0; i < booking.length; i++) {
    dates.push(booking[i].date);
  }
  console.log(dates);

  var space = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var spaceIds = [201, 202, 205, 207, 208, 206, 210];
  maxSpace = 2;

  var checkboxElems = document.querySelectorAll("input[type='checkbox']");

  for (var i = 0; i < checkboxElems.length; i++) {
    checkboxElems[i].addEventListener("click", displayCheck);
  }

  console.log(checkboxElems.length);


  incomdata = document.getElementById("acmbook").innerHTML;
  data = JSON.parse(incomdata);
  console.log(data);
  

  for (i=0; i<data.length; i++){
    if(data[i].space != '🚫 '){
  document.getElementsByName(data[i].date + data[i].name)[0].checked = true;
   document.getElementsByName(data[i].date + data[i].name+ 'space')[0].innerText = data[i].space;
    }



   
  }


















  function displayCheck(e) {
    let a = e.target.id[0];
    let b = e.target.id[1];

    if (e.target.checked) {
      if (space[a] < maxSpace) {
        document.getElementById(e.target.id + "-space").innerHTML =
          spaceIds[space[a]];

        newId = document.getElementById(e.target.id).value;
        if (newId.includes("space")) {
          newId = newId.slice(0, newId.length - 15);

          document.getElementById(e.target.id).value =
            newId + ',"space":"' + spaceIds[space[a]] + '"}';
        } else {
          document.getElementById(e.target.id).value =
            document.getElementById(e.target.id).value +
            ',"space":"' +
            spaceIds[space[a]] +
            '"}';
        }
        space[a] = space[a] + 1;
      } else {
        alert("no sufficient spaces");
        e.target.checked = false;
      }
    } else {
      document.getElementById(e.target.id + "-space").innerHTML = "space";
      console.log(a, b);
      if (space[a] > 0) {
        space[a] = space[a] - 1;
      }
    }
    
  }
});

document.getElementById("button").addEventListener("click", function () {
  const conf = [...document.querySelectorAll(".inp")].map(
    (e) => e.value
  );
  console.log(conf);

  document.getElementById("data").value = conf;
});

// function checkspace(a,b) {

//     var perday = [0 , 0, 0, 0, 0,0, 0, 0, 0, 0,0, 0];
//     var checkbox = document.getElementById(a + "-" + b);
//       if (checkbox.checked = true) {
//         a = parseInt(a);
//         b = parseInt(b);
//         console.log(typeof(a));
//          console.log(a + "-" + b);
//       perday[a] = ++perday[a];
//       console.log(perday[a]);
//   if (perday[a]>1)
//   {
//      alert("no sufficient spaces");
//       document.getElementById(a + "-" + b).checked = false;
//   }
// }

// dates.forEach(function(element) {
//  var checkbox = document.querySelectorAll('.'+ element);
//  console.log(element, checkbox.length);
//     checkbox.forEach(function (element) {
//        });
// });

// var checkbox = document.querySelectorAll("i");
// if (checkbox.checked != true) {
// console.log(dates);
// }

//   var checkbox = document.querySelectorAll(".inp:checked");
//     if (checkbox.checked != true) {
//     alert("you need to be fluent in English to apply for the job");
//   }
// }
