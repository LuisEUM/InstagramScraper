require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");

const app = express();

app.use(express.static(`${__dirname}/react-app`));

// CORS middleware
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:3000");
  res.set("Access-Control-Allow-Headers", "content-type");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, DELETE");
  res.set("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(logger("dev"));


const routes = require("./config/routes.config.js");
app.use("/api/v1", routes);


app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/react-app/index.html`);
});

app.use((error, req, res, next) => {
  const data = {};

  console.error(error);

  if (error instanceof mongoose.Error.ValidationError || error.status === 400) {
    error.status = 400;
    data.errors = error.errors;
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(404, "Resource not found");
  }

  data.message = error.message;

  res.status(error.status || 500);
  res.send(data);
});

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 4000;

  app.listen(port, () =>
    console.log(`Instagram Scrapper is running at the port ${port}`)
  );
}

module.exports = app;