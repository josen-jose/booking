var allday = document.querySelectorAll(".space").length;

for (let i = 0; i < allday; i++) {
  document.querySelectorAll(".space")[i].addEventListener("click", function () {
    var buttonid = this.id;

    buttonAnimation(buttonid);
  });
}

document.addEventListener("DOMContentLoaded", function (event) {
  bookings = document.getElementById("booked").innerHTML;
  var count = document.querySelectorAll(".space");
  for (i = 0; i < count.length; i++) {
    if (bookings.includes(count[i].id)) {
      console.log(count[i].id);
      buttonAnimation(count[i].id);
    }
  }
  spaces = document.getElementById("space").innerHTML;
  data = JSON.parse(spaces);
  days = document.querySelectorAll(".space");
  for (i = 0; i < data.length; i++) {
    sam = JSON.parse(data[i]);
    if (document.getElementById(sam.date).innerHTML.includes(sam.date)) {
      doc = document.getElementById(sam.date).innerHTML;
      document.getElementById(sam.date).innerHTML = doc + "<br>" + sam.space;
    }
  }
for (j = 0; j < days.length; j++) {
len = document.getElementById(days[j].id).innerHTML.length;
if(len<=6)
{
  document.getElementById(days[j].id).innerHTML = document.getElementById(
    days[j].id
  ).innerHTML + '<br>🚫';
}
}


});

function buttonAnimation(currentKey) {
  var activeButton = document.getElementById(currentKey);
  activeButton.classList.toggle("pressed");

  // if (!document.getElementById(currentKey).innerHTML.includes("<br>🚫")) {
  //   document.getElementById(currentKey).innerHTML =
  //     currentKey + "<br>🚫";
  // }
}

document.getElementById("Update").addEventListener("click", function () {
  var ylist = document.querySelectorAll(".pressed");
  var ylists = [];
  ylist.forEach((el) => {
    ylists.push(el.id);
  });

  document.getElementById("ylist").value = ylists;

  // console.log(ylists);
  // console.log(nlists);
});
