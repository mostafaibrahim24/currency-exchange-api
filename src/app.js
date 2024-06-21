const express = require("express");
const morgan = require("morgan");
const routes =require("./route")
const {validateRequest,changeCurrencyCase} = require('./middleware')

const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(morgan("tiny"));
app.use("/currency",validateRequest,changeCurrencyCase,routes)

module.exports = app;