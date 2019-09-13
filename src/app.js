const express = require("express");
const bodyParser = require("body-parser");
const routeSetup = require("./routes/");
const Racing = require("./resources/racing");
const app = express();

const setupApp = async (resources = new Racing()) => {
  app.use(bodyParser.json());
  app.use("/", routeSetup(resources));
  return app;
};

module.exports = {
  setupApp
};
