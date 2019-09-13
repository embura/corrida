const { orderBy } = require("lodash");
const { duration } = require("moment");

const RacingResource = require("../resources/racing");
const Lap = require("../model/lap");
const log = require("../log");
const FINAL_LAP = 4;

class Race {
  constructor(racingResource = new RacingResource()) {
    this.racingResource = racingResource;
    this.bestLap = "";
    this.pilots = [];

    this.pilotCode = "";
    this.pilotName = "";
    this.qtyCompletedLaps = "";
    this.totalTrialTime = "";
  }

  async arrivalPosition() {
    const pilots = await this.racingResource.getPilots();
    let finalPositions = this.getFinalPositions(pilots);
    return finalPositions;
  }

  setFasterLap(finalPositions) {
    let bestlapTime = duration({ m: 99 });
    let idx = 0;
    finalPositions.map((pilot, index) => {
      const [m, s, ms] = pilot.bestLap.lapTime.split(/\D/g);

      const durationLap = duration({
        m: Number(m),
        s: Number(s),
        ms: Number(ms)
      });

      if (bestlapTime > durationLap) {
        bestlapTime = durationLap;
        idx = index;
      }
      return pilot;
    });

    finalPositions[idx].bestLap.bestLapRace = true;
    return finalPositions;
  }

  getFinalPositions(pilots) {
    let finalPositions = [];
    pilots.forEach((pilot, index) => {
      const lastLap = pilot.lastLap();
      if (lastLap.lapNumber <= FINAL_LAP) {
        const lap = new Lap(
          index + 1,
          pilot.code,
          pilot.name,
          pilot.qtyCompletedLaps,
          pilot.totalTrialTime,
          pilot.averageRaceSpeed,
          { ...pilot.bestLap(), bestLapRace: false }
        );
        finalPositions.push(lap);
      }
    });
    finalPositions = orderBy(
      finalPositions,
      ["qtyCompletedLaps", "totalTrialTime"],
      ["desc", "asc"]
    );

    finalPositions = finalPositions.map((pilot, index) => {
      pilot.arrivalPosition = index + 1;
      return pilot;
    });

    finalPositions = this.setFasterLap(finalPositions);
    finalPositions = this.setTimeAfterWinner(finalPositions);

    return finalPositions;
  }

  setTimeAfterWinner(finalPositions = []) {
    let winnerTimer = finalPositions[0].totalTrialTime;

    const finalP = finalPositions.map(pilot => {
      if (winnerTimer < pilot.totalTrialTime) {
        const diff = pilot.totalTrialTime - winnerTimer;
        pilot.timeAfterWinner = this.durantionFormat(duration(diff));
        log.info("[Race] - setTimeAfterWinner : ", pilot.timeAfterWinner);
      }

      pilot.totalTrialTime = this.durantionFormat(pilot.totalTrialTime);
      return pilot;
    });

    return finalP;
  }

  durantionFormat(durantion = durantion()) {
    return durantion
      .toJSON()
      .replace("M", ":")
      .replace(/[A-Z]/g, "");
  }
}

module.exports = Race;
