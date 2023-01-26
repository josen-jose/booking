// install express with `npm install express` 
const express = require('express')
const bodyParser = require("body-parser");
const app = express()
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use(express.static(__dirname + "/public/"));
app.get("/", function (req, res) {
log = 0;
mode = 0;
        res.render("index", { login: log, mode: mode });
 
});


// export 'app'
module.exports = app
