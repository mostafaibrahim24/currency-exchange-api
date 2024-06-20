const express = require("express");
const morgan = require("morgan");
const routes =require("./route")

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use("/currency",routes)

//convert -> provide value

//exchange-rate

module.exports = app;