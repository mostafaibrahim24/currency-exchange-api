const request = require("supertest");
const app = require("../src/app");

describe("/currency/exchange-rate", () => {

  test("Valid request", () => {
    return request(app)
      .post("/currency/exchange-rate")
      .send({
	    from_currency: "usd",
	    to_currency : ["egp"]
        })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
            rates: [
            {
                from_currency: "usd",
                to_currency: "egp",
                rate: 47.71190127
            }
	        ]
        }
        );
      });
  })
  test("Invalid request", () => {
    return request(app)
      .post("/currency/exchange-rate")
      .send({
	    from_currency: "usd",
	    currency : ["egp"]
        })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            Error: "Please adhere to API's required and allowed properties in body",
            required: [
                "to_currency"
            ],
            not_allowed: [
                "currency"
            ]
        }
        );
      });
  })
});

describe("/currency/convert", () => {

  test("Valid request", () => {
    return request(app)
      .post("/currency/convert")
      .send({
	    from_currency: "usd",
	    to_currency : ["egp"],
        amount: 2
        })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
            {
            conversions: [
                {
                from_currency: "usd",
                to_currency: "egp",
                amount: 2,
                result: 95.42380254
                }
            ]
            }
        );
      });
  })
  test("Invalid request", () => {
    return request(app)
      .post("/currency/convert")
      .send({
	    from_currency: "usd",
	    to_currency : ["egp"],
        money: 2
        })
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({
            Error: "Please adhere to API's required and allowed properties in body",
            required: [
                "amount"
            ],
            not_allowed: [
                "money"
            ]
        }
        );
      });
  })
});