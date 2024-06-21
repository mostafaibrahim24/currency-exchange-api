const {
  convert,
  getExchangeRate
} = require("./controller");

const router = require("express").Router();

router.route("/convert").post(convert);
router.route("/exchange-rate").post(getExchangeRate);

module.exports = router;