const express = require("express");
const bodyParser = require("body-parser");
const myntra = require("./myntra");
const uuid = require("uuid").v4;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.headers["request_id"] = uuid();
  // console.log(req.headers);
  next();
});

app.use("/v1/", myntra);

app.listen(3000, () => {
  console.log("Server Started");
});
