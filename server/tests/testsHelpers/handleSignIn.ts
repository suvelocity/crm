//@ts-ignore
import { User, RefreshToken } from "../../models";
import { usersMock, usersCardentials } from "../mocks";
require("dotenv").config();
import request from "supertest";
import server from "../../app";
const AUTH_URL = "/api/v1/auth/signin";

export const handleSignIn = async (userType: string) => {
  await User.destroy({ truncate: true, force: true });
  await RefreshToken.destroy({ truncate: true, force: true });
  await User.bulkCreate(usersMock);
  try {
    switch (userType) {
      case "student":
        return await request(server).post(AUTH_URL).send(usersCardentials[0]);
      case "teacher":
        return await request(server).post(AUTH_URL).send(usersCardentials[1]);
      case "admin":
        return await request(server).post(AUTH_URL).send(usersCardentials[2]);
    }
  } catch (e) {
    return e;
  }
};
