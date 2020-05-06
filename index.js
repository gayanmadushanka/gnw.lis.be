// External Modules
const express = require("express");
const bodyParser = require("body-parser");

// Internal Modules
const documents = require("./routes/documents");
const templates = require("./routes/templates");

// App Variables
const app = express();
const port = process.env.PORT || "3000";

// App Configuration
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/api/v1/documents", documents);
app.use("/api/v1/templates", templates);

// Server Activation
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
