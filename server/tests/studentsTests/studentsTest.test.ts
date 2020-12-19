import request from "supertest";
import {
  handleSignIn,
  extractRefreshToken,
  extractRefreshTokenFull,
  extractAccessTokenFull,
} from "../testsHelpers";
import server from "../../app";
import {
  studentsMock,
  classesMock,
  studentsTestExpectedResult,
  newStudent
} from "../mocks";
//@ts-ignore
import { Student, Class, User } from "../../models";

let accessToken: string;

describe("Students Tests", () => {
  beforeAll(async () => {
    await Student.destroy({ truncate: true, force: true });
    await Class.destroy({ truncate: true, force: true });
    await Student.bulkCreate(studentsMock);
    await Class.bulkCreate(classesMock);
    const authAdmin = await handleSignIn("admin");
    accessToken = extractAccessTokenFull(authAdmin);
  });
  afterAll(async () => {
    await server.close();
  });

  test("Admin should be able to get all student`s information", async (done) => {
    const allStudents = await request(server)
      .get("/api/v1/student/all")
      .set("authorization", `bearer ${accessToken}`);
    expect(allStudents.status).toBe(200);
    expect(allStudents.body.length).toBe(10);
    for (let i = 0; i < 10; i++) {
      expect(allStudents.body[i].id).toBe(studentsTestExpectedResult[i].id);
      expect(allStudents.body[i].idNumber).toBe(
        studentsTestExpectedResult[i].idNumber
      );
      expect(allStudents.body[i].email).toBe(
        studentsTestExpectedResult[i].email
      );
    }
    done();
  });

  test("Admin should be able to get one student`s information", async (done) => {
    for (let i = 1; i < 11; i++) {
      const student = await request(server)
        .get(`/api/v1/student/byId/${i}`)
        .set("authorization", `bearer ${accessToken}`);
      expect(student.status).toBe(200);
      expect(student.body.id).toBe(studentsTestExpectedResult[i - 1].id);

      expect(student.body.idNumber).toBe(
        studentsTestExpectedResult[i - 1].idNumber
      );
      expect(student.body.email).toBe(studentsTestExpectedResult[i - 1].email);
    }
    done();
  });

  test("Admin should be able to change one student information", async (done) => {
    const prevStudent = await request(server)
      .get(`/api/v1/student/byId/1`)
      .set("authorization", `bearer ${accessToken}`);
    expect(prevStudent.body.additionalDetails).toBe("single");
    const student = await request(server)
      .patch(`/api/v1/student/1`)
      .set("authorization", `bearer ${accessToken}`)
      .send({ additionalDetails: "lol" });
    expect(student.status).toBe(200);
    expect(student.body).toEqual({ message: "Student updated" });
    const newStudent = await request(server)
      .get(`/api/v1/student/byId/1`)
      .set("authorization", `bearer ${accessToken}`);
    expect(newStudent.body.additionalDetails).toBe("lol");
    done();
  });

  test("Admin should be able to delete", async (done) => {
    const prevStudents = await request(server)
      .get(`/api/v1/student/all`)
      .set("authorization", `bearer ${accessToken}`);
    expect(prevStudents.body.length).toBe(10);
    const prevStudent = await request(server)
      .get(`/api/v1/student/byId/1`)
      .set("authorization", `bearer ${accessToken}`);
    expect(prevStudent.status).toBe(200);
    const deletedStudent = await request(server)
      .delete(`/api/v1/student/1`)
      .set("authorization", `bearer ${accessToken}`);
    expect(deletedStudent.status).toBe(200);
    expect(deletedStudent.body).toEqual({ message: "Student deleted" });
    const newStudents = await request(server)
      .get(`/api/v1/student/all`)
      .set("authorization", `bearer ${accessToken}`);
    expect(newStudents.body.length).toBe(9);
    const notGonnaBeFoundStudent = await request(server)
      .get(`/api/v1/student/byId/1`)
      .set("authorization", `bearer ${accessToken}`);
    expect(notGonnaBeFoundStudent.status).toBe(404);
    done();
  });
  test("admin should be able to add a student and user", async (done) => {
    const prevStudents = await request(server)
      .get(`/api/v1/student/all`)
      .set("authorization", `bearer ${accessToken}`);
    const prevUsers = await User.findAll();
    const prevUsersLength = prevUsers.length;
    const prevStudentsLength = prevStudents.body.length;
    const postedStudent = await request(server)
      .post(`/api/v1/student`)
      .set("authorization", `bearer ${accessToken}`)
      .send({ ...newStudent, id: 100 });
    // console.log(postedStudent);
    expect(postedStudent.status).toBe(200);
    expect(postedStudent.body.email).toBe(newStudent.email);
    const allStudents = await request(server)
      .get(`/api/v1/student/all`)
      .set("authorization", `bearer ${accessToken}`);
    expect(allStudents.body.length).toBe(prevStudentsLength + 1);
    expect(allStudents.body[prevStudentsLength].email).toBe(
      newStudent.email
    );
    const newUsers = await User.findAll();
    expect(newUsers.length).toBe(prevUsersLength + 1);
    expect(newUsers[prevUsersLength].relatedId).toBe(11);
    done();
  }, 10000);
});
