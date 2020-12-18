//@ts-ignore
import { User, RefreshToken } from "../models";
import { usersMock, usersCardentials } from "./mocks";
require("dotenv").config();
const request = require("supertest");
import server from "../app";

export const handleSignIn = async (userType: string) => {
  await User.destroy({ truncate: true, force: true });
  await RefreshToken.destroy({ truncate: true, force: true });
  await User.bulkCreate(usersMock);
  try {
    switch (userType) {
      case "student":
        return await request(server)
          .post("/api/v1/auth/signin")
          .send(usersCardentials[0]);
      case "teacher":
        return await request(server)
          .post("/api/v1/auth/signin")
          .send(usersCardentials[1]);
      case "admin":
        return await request(server)
          .post("/api/v1/auth/signin")
          .send(usersCardentials[2]);
    }
  } catch (e) {
    return e;
  }
};
