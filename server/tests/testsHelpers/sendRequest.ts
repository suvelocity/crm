import { string } from "joi";
import request from "supertest";
import server from "../../src/app";
type requestMethod = "get" | "post" | "put" | "delete" | "patch";
export const sendRequest = (
  method: string,
  url: string,
  accessToken?: string,
  body?: object
): request => {
  if (!url.startsWith("/api/v1")) {
    const base = "/api/v1";
    url = base + url;
  }
  let newRequest = request(server)[method](url);
  if (accessToken) {
    newRequest = newRequest.set("authorization", `bearer ${accessToken}`);
  }
  if (body) {
    newRequest = newRequest.send(body);
  }
  return newRequest;
};
