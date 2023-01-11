const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const getDates = require("./date");
const { request } = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public/"));

mongoose.connect("mongodb://127.0.0.1:27017/parking", {
  useNewUrlParser: true,
});

// DATABASE SCHEMA ////////////////////////////////////////

const bookingSchema = new mongoose.Schema({
  name: String,
  ylist: [],
  nlist: [],
  booking: [],
});

const Booking = mongoose.model("NewRequest", bookingSchema);

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

const spaceSchema = new mongoose.Schema({
  name: String,
  date: String,
  space: String,
});

const SpaceData = mongoose.model("SpaceData", spaceSchema);

///////////////////////////////////////// LOADING LOGIN PAGE ///////////////

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

///////////////////////////////////////// ADMIN PAGE ///////////////

app.get("/admin", function (req, res) {
  day = getDates();
  let requests = [];
  let data = [];
  let rec = [];
  let j = 0;

  day.forEach((element) => {
    Booking.find(
      { ylist: { $elemMatch: { $regex: element, $options: "i" } } },
      { _id: 0, name: 1, booking: 1 },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          data = [];
          space = [];
          flag = 0;
          for (i = 0; i < docs.length; i++) {
            data.push(docs[i].name);

            // space.push({ name: docs[i].name }, { record: docs[i].booking });
          }
        }
        if (data.length != 0) {
          requests.push({ date: element, book: data});
        }
        j++;

        if (j == 12) {
          reqt = JSON.stringify(requests);
        
          SpaceData.find({},
            { _id: 0, date: 1, name: 1, space: 1 },
            function (err, booked) {
              if (err) {
                console.log(err);
              } else {
                booked = JSON.stringify(booked);
                res.render("admin", { request: reqt, record: booked });
              }
            }
          );
          
          
        }
      }
    );
  });
});

///////////////////////////////////////// LOADING BOOKING PAGE  ///////////////

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  day = getDates();



  User.findOne({ email: email }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          ///////////////////////////////////////// FETCHING DATA ///////////////

          day = getDates();

          Booking.findOne({ name: email }, function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              // docs.ylist.forEach((element) => {
              //   console.log(element);
              // });

              res.render("booking", {
                days: day,
                username: email,
                bookings: docs.ylist,
                space: JSON.stringify(docs.booking),
              });
            }
          });

          ///////////////////////////////////////// LOADING PAGE ///////////////
        } else {
          res.send(
            "<h1> Sorry wrong email or password. Please try again !</h1>"
          );
        }
      } else {
        res.send("<h1> Sorry wrong email or password. Please try again !</h1>");
      }
    }
  });
});

///////////////////////////////////////// BOOKING PAGE SUBMIT BUTTON  ///////////////

app.post("/booked", function (req, res) {
  let yeslists = req.body.ylists;
  let nolists = req.body.nlists;
  let usrname = req.body.email;
  day = getDates();

  var myquery = { name: usrname };
  var newvalues = { $set: { ylist: yeslists, nlists: nolists } };

  Booking.updateOne(myquery, newvalues, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("success");
      // console.log(day, usrname, yeslists);

      // data = {
      //   days: day,
      //   username: usrname,
      //   bookings: yeslists,
      // };

      // res.redirect("booking",data);
    }
  });
   res.redirect("/");
});

//////////////////////////////////// ADMIN-UPDATE ///////////////

app.post("/admin-update", function (req, res) {
  data = "[" + req.body.data + "]";

  data = JSON.parse(data);

  SpaceData.collection.drop();

  //////////// SETTING FIELD TO EMPTY ////////////

  if (data.length != 0) {
    for (i = 0; i < data.length; i++) {
      var date = data[i].date;
      var space = data[i].space;

      var myquery = { name: data[i].book };

      Booking.update(
        myquery,
        { $pull: { booking: { $exists: true } } },
        function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("db cleared");
          }
        }
      );
    }
  }

  //////////// PUSHING BOOKING DATA INTO ARRAY ////////////

  if (data.length != 0) {
    for (i = 0; i < data.length; i++) {
      var date = data[i].date;
      var space = data[i].space;

      var myquery = { name: data[i].book };

      var b_data = '{"date":"' + date + '","space":"' + space + '"}';
      var newvalues = { $push: { booking: b_data } };

      Booking.findOneAndUpdate(
        myquery,
        newvalues,
        { upsert: true },
        function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("sucess");
          }
        }
      );

      SpaceData.findOneAndUpdate(
        { name: data[i].book, date: data[i].date },
        { space: data[i], space },
        { upsert: true },
        function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("updated");
          }
        }
      );
    }
  }
  res.redirect('/');
});
///////////////////////////////////////// SERVER CODE  ///////////////

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
