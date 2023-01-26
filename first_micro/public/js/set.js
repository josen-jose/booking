
window.addEventListener("DOMContentLoaded", (event) => {
  let mode = document.getElementById("incom").innerHTML;
if(mode==1){
  document.getElementById("myToggle").checked = true;
}
elseif(mode==0)
  document.getElementById("myToggle").checked = false;




});




//////////// ADDING BUTTON ANIMATION FUNCTION TO ALL BUTTONS/////////

//   document.getElementById("myToggle").addEventListener("click", function () {
//     var buttonid = this.id;
//     buttonAnimation(buttonid);
//   });



// function buttonAnimation(currentKey) {
//   if (document.getElementById(currentKey).checked)
//     document.getElementById(currentKey).value = 1;

//  if (!document.getElementById(currentKey).checked)
//    document.getElementById(currentKey).value = 0;

// }

  ////////// SUBMIT BUTTON  /////////////

  document.getElementById("submit").addEventListener("click", function () {
// if (!document.getElementById("chk").checked)
//   document.getElementById("myToggle").value = "1";
// else document.getElementById("myToggle").value = "2";



  console.log(document.getElementById("myToggle").value);
    
  });