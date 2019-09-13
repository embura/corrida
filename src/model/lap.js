class Lap {
  constructor(
    arrivalPosition,
    pilotCode,
    pilotName,
    qtyCompletedLaps,
    totalTrialTime,
    averageRaceSpeed,
    bestLap
  ) {
    this.arrivalPosition = arrivalPosition;
    this.pilotCode = pilotCode;
    this.pilotName = pilotName;
    this.qtyCompletedLaps = qtyCompletedLaps;
    this.totalTrialTime = totalTrialTime;
    this.averageRaceSpeed = averageRaceSpeed;
    this.bestLap = bestLap;
  }
}

module.exports = Lap;
