import {
  handleSignIn,
  extractAccessTokenFull,
  sendRequest,
} from "../testsHelpers";
import server from "../../src/app";
import {
  studentsMock,
  classesMock,
  jobsMock,
  jobEventExpectedResults,
  jobEventMock,
} from "../mocks";
//@ts-ignore
import { Student, Class, Event, Job } from "../../src/models";

let accessToken: string;

describe("Students Tests", () => {
  beforeAll(async () => {
    await Student.destroy({ truncate: true, force: true });
    await Class.destroy({ truncate: true, force: true });
    await Job.destroy({ truncate: true, force: true });
    await Event.destroy({ truncate: true, force: true });
    await Student.bulkCreate(studentsMock);
    await Class.bulkCreate(classesMock);
    await Job.bulkCreate(jobsMock);
    await Event.bulkCreate(jobEventMock);
    const authAdmin = await handleSignIn("admin");
    accessToken = extractAccessTokenFull(authAdmin);
  });

  afterAll(async () => {
    await server.close();
  });

  test("Admin should be able to get all job events", async (done) => {
    done();
  });
});
