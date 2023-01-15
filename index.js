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

// const bookingSchema = new mongoose.Schema({
//   name: String,
//   ylist: [],
//   nlist: [],
//   booking: [],
// });

// const Booking = mongoose.model("NewRequest", bookingSchema);

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

const spaceSchema = new mongoose.Schema({
  name: String,
  date: String,
  space: String,
  time: String,
});

const SpaceData = mongoose.model("SpaceData", spaceSchema);

///////////////////////////////////////// LOADING LOGIN PAGE ///////////////

app.get("/", function (req, res) {
  SpaceData.find(
    { _id: "63bf0fdbd28372d7c7176c05" },
    { _id: 1, date: 1, name: 1, space: 1, time: 1 },
    {},
    function (err, log) {
      if (err) {
        console.log(err);
      } else {
        log = JSON.stringify(log[0].space);
        log = log.slice(5, log.length - 8);
        res.render("index", { login: log });
      }
    }
  );
});

///////////////////////////////////////// ADMIN PAGE ///////////////

app.get("/admin", function (req, res) {
  day = getDates();
  data = [];
  record = [];
  var j = 0;

  SpaceData.find(
    {},
    { _id: 1, date: 1, name: 1, space: 1, time: 1 },
    {},
    function (err, booked) {
      if (err) {
        console.log(err);
      } else {
        booked = JSON.stringify(booked);
        res.render("admin", { request: booked, days: day });
      }
    }
  );
});

///////////////////////////////////////// LOADING BOOKING PAGE  ///////////////

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  day = getDates();

  ///////////////////////////////////////// ADMIN PAGE LOGIN  ///////////////
  if (email == "lewis@admin.com" && password == "lewis") {
    SpaceData.find(
      {},
      { _id: 1, date: 1, name: 1, space: 1, time: 1 },
      {},
      function (err, booked) {
        if (err) {
          console.log(err);
        } else {
          booked = JSON.stringify(booked);
          res.render("admin", { request: booked, days: day });
        }
      }
    );
  }

  ///////////////////////////////////////// LOADING USER BOOKING PAGE  ///////////////
  else {
    User.findOne({ email: email }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            ///////////////////////////////////////// FETCHING DATA ///////////////
            day = getDates();
            SpaceData.find(
              { name: email },
              { _id: 0, name: 0, __v: 0 },
              function (err, docs) {
                if (err) {
                  console.log(err);
                } else {
                  docs = JSON.stringify(docs);
                  res.render("booking", {
                    days: day,
                    username: email,
                    bookings: docs,
                  });
                }
              }
            );

            ///////////////////////////////////////// LOADING PAGE ///////////////
          } else {
            res.send(
              "<h1> Sorry wrong email or password. Please try again !</h1>"
            );
          }
        } else {
          res.send(
            "<h1> Sorry wrong email or password. Please try again !</h1>"
          );
        }
      }
    });
  }
});

///////////////////////////////////////// BOOKING PAGE SUBMIT BUTTON  ///////////////

app.post("/booked", function (req, res) {
  let data = req.body.bookreqt;
  let del = req.body.dellist;
  data = JSON.parse(data);
  del = JSON.parse(del);

  if (data.length > 0) {
    for (i = 0; i < data.length; i++) {
      SpaceData.findOneAndUpdate(
        { name: data[i].name, date: data[i].date },
        { space: data[i].space, time: data[i].time },
        { upsert: true },
        function (err, res) {
          if (err) {
            console.log(err);
          } else {
            // console.log("updated");

          }
        }
      );
    }
  }

  console.log(del);
  if (del.length > 0) {
    for (i = 0; i < del.length; i++) {
      SpaceData.findOneAndDelete(
        { name: del[i].name, date: del[i].date },

        function (err, res) {
          if (err) {
            console.log(err);
          } else {
            
            //  console.log('deleted');
          }
        }
      );
    }
  }

  res.redirect("/");
});

//////////////////////////////////// ADMIN-UPDATE ///////////////

app.post("/admin-update", function (req, res) {
  data = req.body.data;
  data = JSON.parse(data);
  for (i = 0; i < data.length; i++) {
    SpaceData.findOneAndUpdate(
      { _id: data[i].ids },
      { space: data[i].space },
      { upsert: true },
      function (err, res) {
        if (err) {
          console.log(err);
        } else {
          // console.log("updated");
        }
      }
    );
  }
});

///////////////////////////////////////// SERVER CODE  ///////////////

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
