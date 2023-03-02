const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const AppError = require("./utils/appError");
const globalErrorHandle = require("./utils/globalErrorHandle");

const routes = require("./routes");

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//Cors is added for mobile or any other platform to avoid future issues.
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("uploads"));

//Separate files for routes and controllers.
app.use("/", routes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandle);
//Uploads is a place holder for future if we need to upload video/image files in any requirement.
module.exports = app;
