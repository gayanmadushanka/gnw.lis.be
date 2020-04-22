// External Modules
const express = require("express");

// Internal Modules
const documents = require("./routes/documents");

// App Variables
const app = express();
const port = process.env.PORT || "3000";

// App Configuration
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use("/api/v1/documents", documents);

// Server Activation
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
