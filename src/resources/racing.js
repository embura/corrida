const fs = require("fs");
const Pilot = require("../model/pilot");

const log = require("../log");
const INDEX_PILOT_CODE = 1;
class Racing {
  constructor(pathFile = `${__dirname}/corrida.log`) {
    this.resourcePath = pathFile;
  }

  async fileToString(path = this.resourcePath) {
    let response = "";
    try {
      response = await fs.readFileSync(path, "utf8");
      log.info("[RacingResource] fileToString sucess");
    } catch (err) {
      log.error(`[RacingResource] ${err.message}: `, err);
    }

    return response;
  }

  stringToArray(dataFile = "") {
    return dataFile
      .replace(/–/g, "")
      .split("\n")
      .map(lap => lap.split(/\s+/));
  }

  async getPilots(pilotCode = "") {
    const data = this.stringToArray(await this.fileToString());

    const listPilot = this.groupBy(data, INDEX_PILOT_CODE);
    const pilots = [];

    for (let [code, laps] of listPilot.entries()) {
      if (pilotCode.length > 0 && code !== pilotCode) {
        continue;
      }
      const pilot = new Pilot(code, laps[0][2]);
      laps.forEach(value =>
        pilot.addLap(
          Number(value[3]),
          value[4],
          value[0],
          Number(value[5].replace(",", "."))
        )
      );
      pilots.push(pilot);
    }

    log.info("[RacingResource] - getPilots length: ", pilots.length);

    return pilots;
  }

  groupBy(matrix = [[]], indexTarget = "") {
    const map = new Map();
    for (let i = 0; i < matrix.length; i++) {
      const lap = matrix[i];
      const code = Number(lap[indexTarget]);

      if (map.has(code)) {
        map.get(code).push(lap);
      } else {
        map.set(code, [lap]);
      }
    }

    return map;
  }
}

module.exports = Racing;
