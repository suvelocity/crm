import request from "supertest";
import { handleSignIn } from "../handleSignIn";
import server from "../../app";

describe("Auth Tests", () => {
  afterAll(async () => {
    await server.close();
  });

  test("Student should be able to sign in and sign out", async (done) => {
    const hi = await handleSignIn("student");
    console.log(hi);
  });
});
