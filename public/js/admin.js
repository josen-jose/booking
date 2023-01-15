window.addEventListener("DOMContentLoaded", (event) => {
  let booking = document.getElementById("incom").innerHTML;
  let day = document.getElementById("days").innerHTML;
  var dates = [];
  let fdates = [];
  booking = JSON.parse(booking);
  for (i = 0; i < booking.length; i++) {
    if (day.includes(booking[i].date)) {
      fdates.push(booking[i].date);
    }
  }
  dates = fdates.sort();
  dates = [...new Set(dates)];

  var spacecount = [0, 0, 0, 0, 0, 0, 0, 0];
  var dayflag = [0,0,0,0,0,0,0,0,0,0,0,0];
  var spaceIds = [50, 51, 52, 53, 54, 55, 56, 57];

  maxSpace = 7;
  var k = 0;
  //////////////// AVAILABILITY FOR 12 DAYS ///////////////////
  for (i = 0; i < 12; i++) {
    window["space_" + i] = [50, 51, 52, 53, 54, 55, 56, 57];
  }

  //////////////// LISTING BOOKING ITEMS ///////////////////

  for (i = 0; i < dates.length; i++) {
    document.getElementById("title" + i).innerHTML =
      "<h5>" + dates[i] + "</h5>";

    target = "title" + i;

    for (j = 0; j < booking.length; j++) {
      if (dates[i] == booking[j].date) {
        const ul = document.getElementById(target);
        const li = document.createElement("li");
        ul.append(li);

        li.innerHTML =
          "<input type=checkbox></input>" +
          booking[j].name +
          "<p>" +
          booking[j].space +
          "</p>" +
          booking[j].time;
        li.classList.add("list-group-item");
        li.classList.add("d-flex");
        li.classList.add("justify-content-between");
        li.classList.add("align-items-center");
        li.id = booking[j]._id;
        li.name = booking[j]._id;
      }
    }
  }

  //////////////// PASSING ON ID TO INTERNAL ELEMENTS ////////////////

  el = document.getElementsByTagName("input");
  for (i = 0; i < el.length; i++) {
    el[i].id = "cb" + el[i].parentElement.id;
  }

  el = document.getElementsByTagName("p");
  for (i = 0; i < el.length; i++) {
    el[i].id = "sp" + el[i].parentElement.id;
  }

  //////////////// RETRIEVEING CHECK BOX////////////////
  booked = document.getElementsByTagName("p").length;
  for (i = 0; i < booked; i++) {
    if (document.getElementsByTagName("li")[i].children[1].innerText != "🚫")
      document.getElementsByTagName("li")[i].children[0].checked = true;
      
  }

  //////////////// REMOVING ALREADY BOOKED SPACES ////////////////

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  for (i = 0; i < booked; i++) {
    if (document.getElementsByTagName("p")[i].innerText != "🚫")
{
     no = document.getElementsByTagName("p")[i].parentNode.parentNode.id.slice(5),
      bkdspace = document.getElementsByTagName("li")[i].children[1].innerHTML;
    
 
      var arr = arrayRemove(window["space_" + no], bkdspace);
      window["space_" + no] = arr

}
  }

  //////////////// REASSIGNING SPACE IDS////////////////

  for (i = 0; i < dates.length; i++) {
    k = 0;
    count = document.getElementById("title" + i).childElementCount;
    for (j = 1; j < count; j++) {
      if (
        document.getElementById("title" + i).children[j].children[0].checked ==
        true
      ) {
        k++;
         dayflag[i] = 1;
      }
    }
    spacecount[i] = k;
   
  }

  //////////// ASSIGNING CLICK ACTION TO CHECKBOX /////////////
  var checkboxElems = document.querySelectorAll("input[type='checkbox']");

  for (var i = 0; i < checkboxElems.length; i++) {
    checkboxElems[i].addEventListener("click", displayCheck);
  }

  //////////// CHECKBOX BUTTON CLICK /////////////
  function displayCheck(e) {
    cb = e.target.id;
    cb = cb.slice(2);
    sp = "sp" + cb;
    //////////// CHECKBOX MAXIMUM PARKING PER DAY /////////////

    title = e.target.parentElement.parentNode.id;
    day = e.target.parentElement.parentNode.firstChild.innerText;

    title = title.slice(5);

    if (e.target.checked) {
      if (spacecount[title] < maxSpace) {
        if (e.target.checked) {
          // if(spacecount[title]>0)
          // {
          //     k = spacecount[title];
          // }
          // else
          // {
          //   k=0;
       
          // }
          k = 0;
          ++spacecount[title];
          var arr = window["space_" + title];
          document.getElementById(sp).innerText = arr[k];
          arr = arrayRemove(arr, arr[k]);
          window["space_" + title]= arr
          k++;
          
        }
      } else {
        alert("Maximum Parking for " + day);
        e.target.checked = false;
      }
    } 
    
 
    else {
      --spacecount[title];
       var arr = window["space_" + title];
     
       cansp = document.getElementById(sp).innerText;   
      arr = window["space_" + title];
     
     arr.unshift(+cansp);
      arr = arr.sort();
      
      document.getElementById(sp).innerText = "🚫";
      --k;
  
    }
   
  }

  //////////// SUBMIT BUTTON  /////////////

  document.getElementById("button").addEventListener("click", function () {
    list = document.getElementsByTagName("input");
    save = [];
    date = new Date();
    time = date.toUTCString();
    for (i = 0; i < list.length - 1; i++) {
      chbx = list[i].id;
      id = chbx.slice(2);
      
      spceid = document.getElementById(chbx).nextSibling.nextSibling.id;
      spce = document.getElementById(spceid).innerHTML;
      if (spce) {
        save.push({ ids: id, space: spce });
      }
    }
    save.push({ ids: "63bf0fdbd28372d7c7176c05", space: time });
    document.getElementById("cb").value = JSON.stringify(save);
    
  });
});

