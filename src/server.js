const app = require("./app.js");

app.listen(process.env.PORT, () => {
  console.log(`Up on ${process.env.PORT}`);
});