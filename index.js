const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
const getDates = require("./date");
const MongoDbStore = require("connect-mongodb-session")(session);
const LocalStrategy = require("passport-local").Strategy;
var nodemailer = require("nodemailer");
var SibApiV3Sdk = require("sib-api-v3-sdk");
const { text } = require("body-parser");
const e = require("express");
const schedule = require("node-schedule");
const { reject } = require("async");
const { resolveContent } = require("nodemailer/lib/shared");
// var defaultClient = SibApiV3Sdk.ApiClient.instance;
const hbs = require("nodemailer-express-handlebars");
const { GetEmailCampaign } = require("sib-api-v3-sdk");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

///////////////////////////////////////// DATABASE CONFIG ///////////////

const mongoURI = "mongodb://127.0.0.1:27017/parking";

app.use(express.static(__dirname + "/public/"));
mongoose.set("strictQuery", false);
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
});

const store = new MongoDbStore({
  uri: mongoURI,
  collection: "session",
});

const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

const User = new mongoose.model("User", userSchema);

const spaceSchema = new mongoose.Schema({
  name: String,
  date: String,
  space: String,
  time: String,
});

const SpaceData = mongoose.model("SpaceData", spaceSchema);

///////////////////////////////////////// EMAIL CONFIG  ///////////////

function sendEmail(toemail, book) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "park.edin.office@gmail.com",
      pass: "lrddttzaatelvwll",
      // pass: "aecomlewis",
      // lrddttzaatelvwll,
    },
  });
// console.log(toemail);
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialDir: "./views",
      defaultLayout: false,
    },
    viewPath: "./views",
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mail_options = {
    from: "park.edin.office@gmail.com",
    to: toemail,
    subject: "Edinburgh Office Parking",
    test: "testing body email",
    template: "email",
    context: {
      email: toemail,
      booking: book,
    },
  };
  transporter.sendMail(mail_options, function (err, info) {
    if (err) {
      console.log(err);
      return reject({ message: "An error has occured" });
    }
    return resolve({ message: "Email send successfully" });
  });
}




///////////////////////////////////////// LOADING LOGIN PAGE ///////////////

app.use(
  session({
    secret: "keysecret",
    resave: false,
    saveUnintialized: true,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
    //   res
    //     .status(401)
    //     .json({ msg: "You are not authorized to view this resource" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect("/");
    // res.status(401).json({
    //   msg: "You are not authorized to view this resource because you are not an admin.",
    // });
  }
};

///////////////////////////////////////// LOADING LOGIN PAGE ///////////////

app.get("/", function (req, res) {
  // req.session.isAuth = true;
  // console.log(req.session);
  // console.log(req.session.id);

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

///////////////////////////////////////// LOADING USER PAGE///////////////

app.get("/userpage", isAuth, function (req, res) {
  const sessionuser = req.session.user;

  day = getDates();
  ///////////////////////////////////////// FETCHING DATA ///////////////
  SpaceData.find(
    { name: sessionuser },
    { _id: 0, name: 0, __v: 0 },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        docs = JSON.stringify(docs);
        res.render("booking", {
          days: day,
          username: sessionuser,
          bookings: docs,
        });
      }
    }
  );
});



///////////////////////////////////////// LOADING SETTING MENU ///////////////

app.get("/setting", isAdmin, function (req, res) {
  SpaceData.findOne(
    { _id: "63bf0fdbd28372d7c7176c05" },
    { },
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        if(doc.name == 0)
        {
          // console.log(doc);
            res.render("setting", {mode:0});
        }
        else
        res.render("setting", { mode: 1 });
      }
    }
  )
});
///////////////////////////////////////// LOADING USER DASHBOARD ///////////////

app.get("/user-dash", isAdmin, function (req, res) {
  User.find({}, {}, {}, function (err, log) {
    if (err) {
      console.log(err);
    } else {
      log = JSON.stringify(log);
      res.render("user", { db: log });
    }
  });
});

///////////////////////////////////////// ADMIN PAGE ///////////////

app.get("/admin", isAdmin, function (req, res) {
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

/////////////////////////////////////////LOGOUT ROUTE ///////////////

app.get("/logout", function (req, res) {
  req.session.destroy();

  res.redirect("/");
});

///////////////////////////////////////// LOADING BOOKING PAGE  ///////////////

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  day = getDates();

  ///////////////////////////////////////// ADMIN PAGE LOGIN  ///////////////
  if (email == "lewis@admin.com" && password == "lewis") {
    req.session.isAdmin = true;
    res.redirect("/admin");
  }

  ///////////////////////////////////////// LOADING USER BOOKING PAGE  ///////////////
  else {
    User.findOne({ email: email }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            req.session.user = email;
            req.session.isAuth = true;
            res.redirect("/userpage");

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

  ///////////////////////////////////////// SENDING DATA TO DATABASE  ///////////////

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

  ///////////////////////////////////////// CANCELLING NOT REQUIRED BOOKING ///////////////

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

  //////////////////////////////////// CHECKING SPACES AND SENDING EMAIL ///////////////

  res.redirect("/userpage");
});




//////////////////////////////////// ADMIN-UPDATE ///////////////

app.post("/setting", function (req, res) {
 mode = req.body.chk;
// console.log(mode);
if(!mode){
  SpaceData.findOneAndUpdate(
    { _id: "63bf0fdbd28372d7c7176c05" },
    { name: "0" },
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
else
{
      date = new Date();
      time = date.toUTCString();
  SpaceData.findOneAndUpdate(
    { _id: "63bf0fdbd28372d7c7176c05" },
    { name: "1", space: time },
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


  res.redirect("/admin");
});


//////////////////////////////////// ADMIN-UPDATE ///////////////

app.post("/admin-update", function (req, res) {
  data = req.body.data;
  data = JSON.parse(data);

  //////////////////////////////////// CHECKING BOOKING CHANGES AND MAILING///////////////

  var records = [];
  SpaceData.find(
    {},
    { _id: 1, date: 1, name: 1, space: 1 },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        // console.log("data", data, "docs", docs);

        for (i = 0; i < docs.length; i++) {
          for (j = 0; j < data.length; j++) {
            check = String(docs[i]._id);
            if (check.includes(data[j].ids)) {
              if (docs[i].space != data[j].space) {
                records.push({
                  email: docs[i].name,
                  date: docs[i].date,
                  space: data[j].space,
                });
              }
            }
          }
        }

        User.find({}, { _id: 0, email: 1 }, function (req, usr) {
          if (err) {
            console.log(err);
          } else {
            for (i = 0; i < usr.length; i++) {
              // console.log("test", usr[i].email);
              var upda = [];
              for (j = 0; j < records.length; j++) {
                if (usr[i].email == records[j].email) {
                  upda.push({ date: records[j].date, space: records[j].space });
                }
              }
            
              //////////////////////////////////// SENDING EMAIL TO UPDATED BOOKING TO USERS ///////////////
              if (upda.length != 0) {
               
                sendEmail(usr[i].email,upda);
              }
            }
          }
        });
      }
    }
  );

  //////////////////////////////////// UPDATING NEW BOOKINGS TO DATABASE///////////////

  for (i = 0; i < data.length; i++) {
    SpaceData.findOneAndUpdate(
      { _id: data[i].ids },
      { name: data[i].name, space: data[i].space },
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

  //////////////////////////////////// CHECKING BOOKING CHANGES AND MAILING///////////////

  res.redirect("/admin");
});

//////////////////////////////////// USER DB -UPDATE ///////////////

app.post("/user-update", function (req, res) {
  del = req.body.del_list;
  up = req.body.up_list;
  del = JSON.parse(del);
  up = JSON.parse(up);

  for (i = 0; i < up.length; i++) {
    if (!up[i].ids) {
      var usr = new User({ email: up[i].email, password: up[i].pass });
      usr.save(function (err, User) {
        if (err) return console.err(err);
      });
    } else {
      User.findOneAndUpdate(
        { _id: up[i].ids },
        { password: up[i].pass },
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

  if (del.length > 0) {
    for (i = 0; i < del.length; i++) {
      User.findOneAndDelete(
        { _id: del[i].id },

        function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
          }
        }
      );
    }
  }
  res.redirect("/user-dash");
});

// ///////////////////////////////////////// AUTOMATIC BOOKING TOOL ONE DAY  ///////////////

schedule.scheduleJob("0 */6 * * *", () => {
  SpaceData.findOne(
    { _id: "63bf0fdbd28372d7c7176c05" },
    {},
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        if (doc.name == 1) {
          day = getDates();
          mode = 1;
          spcs = [50, 51, 52, 53, 54, 55, 56, 57];
          function arrayRemove(arr, value) {
            return arr.filter(function (ele) {
              return ele != value;
            });
          }

          SpaceData.find(
            { date: day[0] },
            { date: 1, name: 1, space: 1, time: 1 },
            {},
            function (err, booked) {
              if (err) {
                console.log(err);
              } else {
                for (i = 0; i < booked.length; i++) {
                  spcs = arrayRemove(spcs, booked[i].space);
                }
                // console.log(spcs);
                if (spcs.length != 0) {
                  for (j = 0; j < booked.length; j++) {
                    if (booked[j].space.includes("🚫")) {
                      giv = spcs[0];

                      booked[j].space = spcs[0];
                      // console.log(spcs[0]);

                      SpaceData.findOneAndUpdate(
                        { name: booked[j].name, date: day[0] },
                        { space: spcs[0] },
                        { upsert: false },
                        function (err, res) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(" interval updated");
                          }
                        }
                      );
                      spcs = arrayRemove(spcs, giv);
                      upda = [{ date: day[0], space: giv }];
                      ///////////////////////////////////////// SEND EMAIL CONFIRMATION ///////////////
                      sendEmail(booked[j].name, upda);
                    }
                  }
                  // console.log(spcs);
                }
              }
            }
          );
        }
      }
    }
  );
});

// ///////////////////////////////////////// SERVER CODE  ///////////////

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
