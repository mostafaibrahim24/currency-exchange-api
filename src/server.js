const app = require("./app.js");
const swaggerUi = require("swagger-ui-express")

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

app.listen(process.env.PORT, () => {
  console.log(`Up on ${process.env.PORT}`);
});