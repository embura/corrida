const { Router } = require("express");
const router = Router();
const log = require("../log");
const Race = require("../model/race");

const routeSetup = RacingResource => {
  router.get("/race", async (req, res) => {
    const race = new Race(RacingResource);

    log.info("[routeSetup] - /race  statusCode: ", res.statusCode);

    res.json(await race.arrivalPosition());
  });

  return router;
};

module.exports = routeSetup;
