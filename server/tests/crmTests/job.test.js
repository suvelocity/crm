//@ts-ignore
import { Student, Class, User, Job } from "../../src/models";
import { classesMock, studentsMock, jobsMock } from "../mocks";
import {
  deleteById,
  extractAccessTokenFull,
  sendRequest,
  getAll,
  getById,
  handleSignIn,
  patchById,
  post,
} from "../testsHelpers";
import server from "../../src/app";
import { jobsTestExpectedResults } from "../mocks/jobs/jobsTestExpectedResults";

let accessToken;

const getCurrentJobs = async () => await getAll("job", accessToken);
const getJobById = async (id) => await getById(id, "job", accessToken, '?only=jobs');
const postNewJob = async (body) => await post("job", accessToken, body);
const patchJobById = async (id, body) =>
  await patchById(id, "job", accessToken, body);
const deleteJobById = async (id) => await deleteById(id, "job", accessToken);

const mockAddedJob = {
  id: 3,
  position: "test job",
  companyId: 1,
  description: "test description",
  contact: "Nitzan - 054545454",
  location: "Tel Mond, Israel",
  requirements: "be awesome",
  additionalDetails: "Shahar Eliyahu is a MASSIVE snake",
  createdAt: (new Date).toISOString().slice(0,10),
  updatedAt: (new Date).toISOString().slice(0,10),
  deletedAt: null,
};

const mockUpdate = {
  position: "updated job",
  description: "updated description",
  contact: "updated",
  location: "Kadima Zoran, Israel",
  requirements: "Update",
  additionalDetails: "Shahar Eliyahu is a STILL MASSIVE snake",
};

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

  it("Should get all jobs", async () => {
    const allJobs = await getCurrentJobs();

    expect(allJobs.status).toBe(200);
    expect(allJobs.body.length).toBe(2);

    for (let i in allJobs.body) {
      expect(allJobs.body[i].id).toBe(jobsTestExpectedResults[i].id);
      expect(allJobs.body[i].position).toBe(
        jobsTestExpectedResults[i].position
      );
    }
  });

  it("Can Access event process-options route", async () => {
    const {status} = await sendRequest("get", '/event/process-options', accessToken)
    expect(status).toBe(200);
  })

  it("Should get a job by id", async () => {
    const id = 2;
    const singleJob = await getJobById(id);

    expect(singleJob.status).toBe(200);
    expect(singleJob.body.id).toBe(id);
    expect(singleJob.body.position).toBe(
      jobsTestExpectedResults.find((jter) => jter.id === id).position
    );
  });

  it("Should add a job", async () => {
    const addedJob = await postNewJob(mockAddedJob);

    expect(addedJob.status).toBe(200);
    for (let field in addedJob.body) {
      if (field === "createdAt" || field === "updatedAt") {
        expect(addedJob.body[field].slice(0, 10)).toBe(mockAddedJob[field]);
      } else {
        expect(addedJob.body[field]).toBe(mockAddedJob[field]);
      }
    }
  });

  it("Should update all fields of job", async () => {
    const id = 2;
    const updatedJobMsg = await patchJobById(id, mockUpdate);

    expect(updatedJobMsg.status).toBe(200);
    expect(updatedJobMsg.body.message).toBe("Job updated");

    const { body: updatedJob } = await getJobById(id);
    console.log(updatedJob)
    for (let field in mockUpdate) {
      console.log(field, updatedJob[field], mockUpdate[field])
      expect(updatedJob[field]).toBe(mockUpdate[field]);
    }
  });

  it("Should delete a job", async () => {
    const id = 1;

    const preDeletedJob = await getJobById(id);
    const deletedJobMsg = await deleteJobById(id);
    const postDeletedJob = await getJobById(id);

    expect(preDeletedJob.deletedAt).toBe(undefined);
    expect(deletedJobMsg.status).toBe(200);
    expect(deletedJobMsg.body.message).toBe("Job deleted");
    expect(postDeletedJob.status).toBe(404);
    expect(postDeletedJob.body.error).toBe("Job does not exist");
  });
});
