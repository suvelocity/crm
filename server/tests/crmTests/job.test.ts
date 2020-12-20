//@ts-ignore
import { Student, Class, User, Job } from "../../models";
import { classesMock, studentsMock, jobsMock } from "../mocks";
import { extractAccessTokenFull, handleSignIn } from "../testsHelpers";

let accessToken: string;

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
});
