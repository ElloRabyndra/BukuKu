const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const port = 5000;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(fileUpload());
app.use(cookieParser());

// =====================================================================
// App Routes
app.use("/", require("./routes/get"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/nowReading"));
app.use("/", require("./routes/books"));
app.use("/", require("./routes/categories"));

// =====================================================================
app.listen(port, function () {
  console.log("Listening to http://localhost:5000");
});
