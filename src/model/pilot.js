const moment = require("moment");
const log = require("../log");
const { orderBy } = require("lodash");

class Pilot {
  constructor(pilotCode = "", pilotName = "") {
    this.code = pilotCode;
    this.name = pilotName;
    this.totalTrialTime = moment.duration();
    this.laps = [];
    this.qtyCompletedLaps = 0;
    this.averageRaceSpeed = 0;
  }

  addLap(lapNumber = 0, lapTime = "", lapCompletedAt = "", averageSpeed = 0) {
    if (!lapNumber > 0 || !lapTime.length > 0 || !lapCompletedAt.length > 0) {
      return false;
    }
    this.laps.push({ lapNumber, lapTime, lapCompletedAt, averageSpeed });
    this.setTotalTrialTime(lapTime);
    this.qtyCompletedLaps += 1;
    this.averageRaceSpeed = this.setAverageRaceSpeed();

    log.info("[Pilot] - getPilots addLap: ", true);

    return true;
  }

  setAverageRaceSpeed() {
    let sumAverageSpeed = 0;
    for (let i = 0; i < this.laps.length; i++) {
      sumAverageSpeed = sumAverageSpeed + this.laps[i].averageSpeed;
    }
    return sumAverageSpeed / this.laps.length;
  }

  lastLap() {
    let last = [...this.laps];
    last = last.sort((lapA, lapB) => {
      const timeA = moment(lapA.lapCompletedAt, "HH:mm:ss.SSS");
      const timeB = moment(lapB.lapCompletedAt, "HH:mm:ss.SSS");

      if (timeA > timeB) {
        return -1;
      }

      if (timeB > timeA) {
        return 1;
      }
      return 0;
    });

    return last[0];
  }

  setTotalTrialTime(lapTime = "") {
    const durationLap = this.convertStringToDurantion(lapTime);
    this.totalTrialTime = this.totalTrialTime.add(durationLap);
  }

  convertStringToDurantion(lapTime) {
    const [m, s, ms] = lapTime.split(/\D/g);
    const durationLap = moment.duration({
      m: Number(m),
      s: Number(s),
      ms: Number(ms)
    });
    return durationLap;
  }

  durantionToString(duration = moment.duration()) {
    return duration.replace("M", ":").replace(/[A-Z]/, "");
  }

  sortLapByProp(prop = "lapTime", sense = "desc") {
    return orderBy(this.laps, [prop], [sense]);
  }

  bestLap() {
    const best = this.sortLapByProp("lapTime", "asc");
    return best[0];
  }
}

module.exports = Pilot;
