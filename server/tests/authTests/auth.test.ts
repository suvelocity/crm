import request from "supertest";
import {
  handleSignIn,
  extractRefreshToken,
  extractRefreshTokenFull,
} from "../testsHelpers";
import server from "../../src/app";
import { studentsMock } from "../mocks";
//@ts-ignore
import { Student } from "../../src/models";

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

  test("Admin should be able to sign in and sign out", async (done) => {
    const authAdmin = await handleSignIn("admin");
    expect(authAdmin.status).toBe(200);
    expect(authAdmin.headers["set-cookie"].length).toBe(2);
    const refreshToken = authAdmin.headers["set-cookie"][0];
    const accessToken = authAdmin.headers["set-cookie"][1];
    expect(refreshToken.startsWith("refreshToken")).toBe(true);
    expect(accessToken.startsWith("accessToken")).toBe(true);
    expect(authAdmin.body).toEqual({ userType: "admin" });
    const signOutResponse = await request(server)
      .post("/api/v1/auth/signout")
      .send({
        refreshToken: extractRefreshToken(refreshToken),
      });
    expect(signOutResponse.status).toBe(200);
    expect(signOutResponse.body).toEqual({ success: true });
    done();
  });

  test("should be able to get accessToken with refreshToken", async (done) => {
    const authAdmin = await handleSignIn("admin");
    const refreshToken = extractRefreshTokenFull(authAdmin);
    const getTokenResponse = await request(server)
      .post("/api/v1/auth/token")
      .send({
        refreshToken,
      });
    expect(getTokenResponse.status).toBe(200);
    expect(getTokenResponse.body).toEqual({ userType: "admin" });
    done();
  });

  test("should not be able to get accessToken without sending token", async (done) => {
    const authAdmin = await handleSignIn("admin");
    const refreshToken = extractRefreshTokenFull(authAdmin);
    const getTokenResponse = await request(server).post("/api/v1/auth/token");
    expect(getTokenResponse.status).toBe(400);
    expect(getTokenResponse.body).toEqual({ error: "No refresh token" });
    done();
  });

  test("should not be able to get accessToken without valid token", async (done) => {
    const authAdmin = await handleSignIn("admin");
    const refreshToken = extractRefreshTokenFull(authAdmin);
    const getTokenResponse = await request(server)
      .post("/api/v1/auth/token")
      .send({ refreshToken: "invalidToken" });
    expect(getTokenResponse.status).toBe(500);
    done();
  });
});
