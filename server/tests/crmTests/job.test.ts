//@ts-ignore
import { Student, Class, User, Job } from "../../src/models";
import { classesMock, studentsMock, jobsMock } from "../mocks";
import {
  deleteById,
  extractAccessTokenFull,
  getAll,
  getById,
  handleSignIn,
  patchById,
} from "../testsHelpers";
import server from "../../src/app";
import { jobsTestExpectedResults } from "../mocks/jobs/jobsTestExpectedResults";
import expectCt from "helmet/dist/middlewares/expect-ct";

let accessToken: string;

const getCurrentJobs = async () => await getAll("job", accessToken);
const getJobById = async (id: number) =>
  await getById(id, "student", accessToken);
const patchJobById = async (id: number, body: object) =>
  await patchById(id, "student", accessToken, body);
const deleteJobById = async (id: number) =>
  await deleteById(id, "student", accessToken);

describe("Job tests", () => {
  beforeAll(async () => {
    await Student.destroy({ truncate: true, force: true });
    await Job.destroy({ truncate: true, force: true });
    await Class.destroy({ truncate: true, force: true });
    await Student.bulkCreate(studentsMock);
    await Job.bulkCreate(jobsMock);
    await Class.bulkCreate(classesMock);
    const authAdmin = await handleSignIn("admin");
    accessToken = extractAccessTokenFull(authAdmin);
  });
  afterAll(async () => {
    await server.close();
  });

  it.only("Should get all jobs", async () => {
    const allJobs = await getCurrentJobs();

    expect(allJobs.status).toBe(200);
    expect(allJobs.body.length).toBe(2);

    for (let i in allJobs.body) {
      console.log(i);
      expect(allJobs.body[i].id).toBe(jobsTestExpectedResults[i].id);
      expect(allJobs.body[i].position).toBe(
        jobsTestExpectedResults[i].position
      );
    }
  });
});
