const supertest = require("supertest");
const config = require("config");
const resourceUsersUrl = config.get("recourses.users.url");
const { setupApp } = require("../../../../src/app.js");
const fs = require("fs");
const Racing = require("../../../../src/resources/racing");
describe("Race resource", () => {
  let request;
  let winner = {
    arrivalPosition: 1,
    pilotCode: 11,
    pilotName: "S.VETTEL",
    qtyCompletedLaps: 4,
    totalTrialTime: "4:11.578",
    averageRaceSpeed: 28.2175,
    bestLap: {
      lapNumber: 4,
      lapTime: "1:01.096",
      lapCompletedAt: "23:54:57.757",
      averageSpeed: 35.633,
      bestLapRace: true
    }
  };

  const path = `${__dirname}/test.log`;

  const data = `23:49:08.277      038 – F.MASSA                           1		1:02.852                        44,275
23:49:10.858      033 – R.BARRICHELLO                     1		1:04.352                        43,243
23:49:11.075      002 – K.RAIKKONEN                       1   1:04.108                        43,408
23:49:12.667      023 – M.WEBBER                          1		1:04.414                        43,202
23:49:30.976      015 – F.ALONSO                          1		1:18.456						            35,47
23:50:11.447      038 – F.MASSA                           2		1:03.170                        44,053
23:50:14.860      033 – R.BARRICHELLO                     2		1:04.002                        43,48
23:50:15.057      002 – K.RAIKKONEN                       2   1:03.982                        43,493
23:50:17.472      023 – M.WEBBER                          2		1:04.805                        42,941
23:50:37.987      015 – F.ALONSO                          2		1:07.011						            41,528
23:51:14.216      038 – F.MASSA                           3		1:02.769                        44,334
23:51:18.576      033 – R.BARRICHELLO		          	      3		1:03.716                        43,675
23:51:19.044      002 – K.RAIKKONEN                       3		1:03.987                        43,49
23:51:21.759      023 – M.WEBBER                          3		1:04.287                        43,287
23:51:46.691      015 – F.ALONSO                          3		1:08.704						            40,504
23:52:01.796      011 – S.VETTEL                          1		1:01.315						            13,169
23:52:17.003      038 – F.MASSA                           4		1:02.787                        44,321
23:52:22.586      033 – R.BARRICHELLO		          	      4		1:04.010                     	  43,474
23:52:22.120      002 – K.RAIKKONEN                       4		1:03.076                        44,118
23:52:25.975      023 – M.WEBBER                          4		1:04.216                        43,335
23:53:06.741      015 – F.ALONSO                          4		1:20.050						            34,763
23:53:39.660      011 – S.VETTEL                          2		1:01.864						            28,435
23:54:57.757      011 – S.VETTEL                          3		1:01.097						            35,633
23:55:57.757      011 – S.VETTEL                          4		1:01.096						            35,633`;

  beforeAll(async () => {
    try {
      fs.writeFileSync(path, data, { mode: 0o755 });
    } catch (err) {
      // An error occurred
      console.error(err);
    }

    resources = new Racing(`${__dirname}/test.log`);
    const app = await setupApp(resources);
    request = supertest(app);
  });

  afterEach(() => {
    fs.unlink(path, err => {
      if (err) {
        console.error(" File delete err:", err);
        throw err;
      }
    });
  });

  describe("route /", () => {
    describe("when a GET request is done to / endpoint", () => {
      test("should respond with the arrival Position", async () => {
        const response = await request.get("/race");

        expect(response.body[0].arrivalPosition).toEqual(
          winner.arrivalPosition
        );
        expect(response.body[0].pilotCode).toEqual(winner.pilotCode);
        expect(response.body[0].pilotName).toEqual(winner.pilotName);
        expect(response.body[0].qtyCompletedLaps).toEqual(
          winner.qtyCompletedLaps
        );
        expect(response.body[0].averageRaceSpeed).toEqual(
          winner.averageRaceSpeed
        );
      });
    });
  });
});
