const express = require("express");
const bodyParser = require("body-parser");
const getDates = require("./date");

const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/parking", {
  useNewUrlParser: true,
});

const bookingSchema = new mongoose.Schema({
  name: String,
  ylist: [],
  nlist: [],
});

const Booking = mongoose.model("NewRequest", bookingSchema);

day = getDates();

let yfinal;


Booking.findOne({ name: "josen.mundencherry@aecom.com" }, function (err, docs) {
  if (err) {
    console.log(err);
  } else {
   console.log(docs.ylist);
console.log(JSON.stringify(docs.ylist));

  //  docs.ylist.forEach(element => {
  //   console.log(element);
  //  });



  }

});

// day.forEach((element) => {
//   res = JSON.stringify(yfinal);
//           result = res.includes(element);
//           if (result == true) {
      
//             console.log(element);
// }});

// });




// console.log(yfinal);

// day.forEach((element) => {

//  let result = yfinal.includes(element);
//         if (result == true) {
//                  console.log(element);
//       }
//     })

// result = res.includes(element);
// if (result == true) {
//   console.log(result, element);
// }

// Booking.find(
//   { name: "josen.mundencherry@aecom.com" },
//   { ylist: { $elemMatch: { $regex: /.*Jan-7.*/, $options: "i" } } },
//   function (err, docs) {
//     if (err) {
//       console.log(err);
//     } else {

//       console.log(docs);
//     }
//   }
// );

// day.forEach((element) => {
//   Booking.find({ name: "josen.mundencherry@aecom.com" }, function (err, docs) {
//     if (err) {
//       console.log(err);
//     } else {
//       // console.log(docs);
//       // console.log(docs.length);

//       for (let i = 0; i < docs.length; i++) {
//         let yfinal = docs[i].ylist;
//         res = JSON.stringify(yfinal);
//         result = res.includes(element);
//         if (result == true) {
//        bookingData[i] = element;
//           // console.log( bookingData );
//           console.log(bookingData);
//           return bookingData;
//         }
//       }
//     }
//   });

// });
