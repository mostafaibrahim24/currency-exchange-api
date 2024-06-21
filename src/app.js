const express = require("express");
const morgan = require("morgan");
const rl = require('express-rate-limit')



const routes =require("./route")

const {validateRequest,changeCurrencyCase} = require('./middleware')

const app = express();

const limiter = rl({
	windowMs: 15 * 60 * 1000, // 15 mins
	max: 100, // IP has 100 requests over 15 mins
})

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(morgan("tiny"));
app.use(limiter)



app.use("/currency",validateRequest,changeCurrencyCase,routes);



module.exports = app;