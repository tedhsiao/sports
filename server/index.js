const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8080;
const playerRouter = require("./routes/player");
const scheduleRouter = require("./routes/schedule");
const authRouter = require("./routes/auth");
const bodyParser = require("body-parser");
const config = require("./config/config");
var jwt = require("express-jwt");

const API = "/api/";

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token"
  );
  next();
});

app.use(
  jwt({
    secret: "sY6IY99BPR_FD-RrFN5T9R9MP6yviMZf1PM0zH8FfRycdHLzmHVBj7kLjYeoOYgV",
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        console.log(req.headers.authorization.split(" ")[1]);
        return req.headers.authorization.split(" ")[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  })
);

app.use(express.static(path.join(__dirname, "../dist")));
app.use(API + "player", playerRouter);
app.use(API + "schedule", scheduleRouter);
app.use(API + "auth", authRouter);

app.get("/", function(req, res) {
  res.send("Hello World!");
});

const db = require("./db");

//db.createDataBase();
db.connect(process.env.DATABASE_NAME || config.mysqldb, function(err) {
  if (err) {
    console.log("Database connection error");
  } else {
    console.log("Database connection successful");
  }
});

db.createTables();
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

app.listen(port, function() {
  console.log(`Example app listening on ${port} port!`);
});
