const Pilot = require("../../../../src/model/pilot");
describe("Pilot model", () => {
  let pilot = {};
  beforeAll(() => {
    pilot = new Pilot("001", "Senna");
  });

  test("should add new lap in pilot", async () => {
    const lapNumber = 1;
    const lapTime = "1:01.780";
    const lapCompletedAt = "23:49:01.277";
    const averageSpeed = "44.500";

    pilot.addLap(lapNumber, lapTime, lapCompletedAt, averageSpeed);

    expect(pilot.laps[0].averageSpeed).toEqual(averageSpeed);
    expect(pilot.laps[0].lapTime).toEqual(lapTime);
    expect(pilot.laps[0].lapNumber).toEqual(lapNumber);
    expect(pilot.laps[0].lapCompletedAt).toEqual(lapCompletedAt);
  });
});
