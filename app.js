var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var users = require("./routes/documents");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/documents", users);

// app.listen(3000, () => console.log("Server ready"));

module.exports = app;

//lsof -i tcp:3000 -t
// kill -9 PID
