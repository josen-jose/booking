module.exports = getDates;
function getDates(){
let optionsmon = {
  month: "short",
  };
  let optionsday = {
    day: "numeric",
  };

var alldays = [];

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  datemon = date.toLocaleDateString("en-US", optionsmon);
  dateday = date.toLocaleDateString("en-US", optionsday);
  date = datemon+"-"+dateday
    return date;
};

var date = new Date();


for (let i = 0; i < 12; i++) {
  alldays.push(date.addDays(i));
}

return alldays;

}

