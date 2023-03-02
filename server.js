require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const app = require("./app");
const relations = require("./relations");

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV;

const db = require("./config/db-connection");

app.listen(port, "0.0.0.0", function () {
  console.log(`Server is running on ${port} and in ${environment} environment`);
  relations();
});
