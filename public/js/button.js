var allday = document.querySelectorAll(".space").length;
usr = document.getElementById("usr").innerHTML;

//////////// ADDING BUTTON ANIMATION FUNCTION TO ALL BUTTONS/////////

for (let i = 0; i < allday; i++) {
  document.querySelectorAll(".space")[i].addEventListener("click", function () {
    var buttonid = this.id;
    buttonAnimation(buttonid);
  });
}

document.addEventListener("DOMContentLoaded", function (event) {
  //////////// RELOADING ALL BOOKINGS /////////

  book = document.getElementById("booked").innerHTML;

  booking = JSON.parse(book);
  
  for (i = 0; i < booking.length; i++) {
  if (document.getElementById(booking[i].date)){
    this.getElementById(booking[i].date).innerHTML =
      booking[i].date + "<br>" + booking[i].space;
    buttonRead(booking[i].date);}
  }
});

function buttonAnimation(currentKey) {
    var activeButton = document.getElementById(currentKey);
  if (activeButton.classList.contains("pressed")){
      activeButton.classList.toggle("pressed");
  activeButton.classList.toggle("new");
  activeButton.classList.toggle("delete");
  }
  else{
  
  activeButton.classList.toggle("pressed");
  activeButton.classList.toggle("new");
  }
}

function buttonRead(currentKey) {
  var activeButton = document.getElementById(currentKey);
  
  activeButton.classList.toggle("pressed");
}

  //////////// PUSHING NEW REQUEST /////////

document.getElementById("Update").addEventListener("click", function () {
  var newbook = document.querySelectorAll(".new");
  newreq =[];
  date = new Date();

  for (i = 0; i < newbook.length; i++) {
    data = {
      date: newbook[i].id,
      name: usr,
      space: "🚫 ",
      time: date.toUTCString(),
    };
    
    newreq.push(data);
  }



  var cancel = document.querySelectorAll(".delete");
  deletelist = [];
  for(j=0; j<cancel.length; j++){
    deleteit = {
      date : cancel[j].id,
      name : usr,
    }
    deletelist.push(deleteit);
  }
  
  document.getElementById("bookreqt").value = JSON.stringify(newreq);
  document.getElementById("dellist").value = JSON.stringify(deletelist);
});
