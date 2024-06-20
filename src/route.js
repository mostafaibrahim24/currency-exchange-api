const {
  convert,
  getExchangeRate
} = require("./controller");

const router = require("express").Router();

router.route("/convert").get(convert);
router.route("/exchange-rate").get(getExchangeRate);

module.exports = router;