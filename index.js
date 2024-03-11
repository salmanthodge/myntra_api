const express = require("express");
const bodyParser = require("body-parser");
const myntra = require("./myntra");
const uuid = require("uuid").v4;
const cors = require("cors");
var morgan = require("morgan");
var fs = require('fs');
var path = require('path')
// var logger = morgan("combined");
const app = express();
app.use(bodyParser.json());

const options = {
  origin: "*",
  methods: "GET,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(options));
// app.use(morgan("common"));
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))
app.use((req, res, next) => {
  req.headers["request_id"] = uuid();
  // console.log(req.headers);
  next();
});

app.use("/v1", myntra);

app.listen(3000, () => {
  console.log("Server Started");
});
