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
const newEvent = {
  relatedId: 1,
  eventName: "Started application process",
  userId: 1,
  date: new Date(),
  type: "jobs",
};

let accessToken: string;
const getAllEvents = async () =>
  await sendRequest("get", "/event/all", accessToken);

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
    const allEvents = await getAllEvents();
    expect(allEvents.status).toBe(200);
    expect(allEvents.body.length).toBe(jobEventExpectedResults.length);
    for (let i = 0; i < allEvents.body.length; i++) {
      const event = allEvents.body[i];
      const expectedEvent = jobEventExpectedResults[i];
      expect(event.Student).toBeDefined();
      expect(event.Job).toBeDefined();
      expect(event.eventName).toBe(expectedEvent.eventName);
      expect(event.Student.firstName).toBe(expectedEvent.Student.firstName);
    }
    done();
  });

  test("Admin should be able to get all job events processes", async (done) => {
    const allEventsProcesses = await sendRequest(
      "get",
      "/event/allprocesses",
      accessToken
    );
    expect(allEventsProcesses.status).toBe(200);
    expect(allEventsProcesses.body.length).toBe(jobEventExpectedResults.length);
    for (let i = 0; i < allEventsProcesses.body.length; i++) {
      const event = allEventsProcesses.body[i];
      const expectedEvent = jobEventExpectedResults[i];
      expect(event.Student).toBeDefined();
      expect(event.Student.Class).toBeDefined();
      expect(event.Job).toBeDefined();
      expect(event.eventName).toBe(expectedEvent.eventName);
      expect(event.Student.firstName).toBe(expectedEvent.Student.firstName);
    }
    done();
  });

  test("Admin should be able to add job events", async (done) => {
    const prevEvents = await getAllEvents();
    const postedEvent = await sendRequest(
      "post",
      "/event",
      accessToken,
      newEvent
    );
    expect(postedEvent.status).toBe(200);
    expect(postedEvent.body.id).toBe(4);
    const newEvents = await getAllEvents();
    expect(prevEvents.length).toBe(newEvents.length);
    done();
  });
});
