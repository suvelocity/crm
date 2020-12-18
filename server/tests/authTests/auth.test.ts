import request from "supertest";
import { handleSignIn, extractRefreshToken } from "../testsHelpers";
import server from "../../app";
import { studentsMock } from "../mocks";
//@ts-ignore
import { Student } from "../../models";

describe("Auth Tests", () => {
  beforeAll(async () => {
    await Student.destroy({ truncate: true, force: true });
    await Student.create(studentsMock[0]);
  });
  afterAll(async () => {
    await server.close();
  });

  test("Student should be able to sign in and sign out", async (done) => {
    const authStudent = await handleSignIn("student");
    expect(authStudent.status).toBe(200);
    expect(authStudent.headers["set-cookie"].length).toBe(2);
    const refreshToken = authStudent.headers["set-cookie"][0];
    const accessToken = authStudent.headers["set-cookie"][1];

    expect(refreshToken.startsWith("refreshToken")).toBe(true);
    expect(accessToken.startsWith("accessToken")).toBe(true);
    const signOutResponse = await request(server)
      .post("/api/v1/auth/signout")
      .send({
        refreshToken: extractRefreshToken(refreshToken),
      });
    expect(signOutResponse.status).toBe(200);
    expect(signOutResponse.body).toEqual({ success: true });

    done();
  });
});
