import {
  handleSignIn,
  extractAccessTokenFull,
  sendRequest,
} from "../testsHelpers";
import server from "../../app";
import {
  studentsMock,
  classesMock,
  studentsTestExpectedResult,
  newStudent,
} from "../mocks";
//@ts-ignore
import { Student, Class, User } from "../../models";

let accessToken: string;

const getCurrentStudents = async () =>
  await sendRequest("get", `/student/all`, accessToken);
const getStudentById = async (id: number) =>
  await sendRequest("get", `/student/byId/${id}`, accessToken);
const patchStudentById = async (id: number, body: object) =>
  await sendRequest("patch", `/student/${id}`, accessToken, body);
const deleteStudentById = async (id: number) =>
  await sendRequest("delete", `/student/${id}`, accessToken);

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
    const allStudents = await getCurrentStudents();
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
      const student = await getStudentById(i);
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
    const prevStudent = await getStudentById(1);
    expect(prevStudent.body.additionalDetails).toBe("single");

    const student = await patchStudentById(1, { additionalDetails: "lol" });
    expect(student.status).toBe(200);
    expect(student.body).toEqual({ message: "Student updated" });

    const newStudent = await getStudentById(1);
    expect(newStudent.body.additionalDetails).toBe("lol");
    done();
  });

  test("Admin should be able to delete", async (done) => {
    const prevStudents = await getCurrentStudents();
    expect(prevStudents.body.length).toBe(10);

    const prevStudent = await getStudentById(1);
    expect(prevStudent.status).toBe(200);

    const deletedStudent = await deleteStudentById(1);
    expect(deletedStudent.status).toBe(200);
    expect(deletedStudent.body).toEqual({ message: "Student deleted" });

    const newStudents = await getCurrentStudents();
    expect(newStudents.body.length).toBe(9);

    const notGonnaBeFoundStudent = await getStudentById(1);
    expect(notGonnaBeFoundStudent.status).toBe(404);
    done();
  });
  test("admin should be able to add a student and user", async (done) => {
    const prevStudents = await getCurrentStudents();

    const prevUsers = await User.findAll();
    const prevUsersLength = prevUsers.length;
    const prevStudentsLength = prevStudents.body.length;

    const postedStudent = await sendRequest("post", `/student`, accessToken, {
      ...newStudent,
      id: 100,
    });
    expect(postedStudent.status).toBe(200);
    expect(postedStudent.body.email).toBe(newStudent.email);

    const allStudents = await getCurrentStudents();
    expect(allStudents.body.length).toBe(prevStudentsLength + 1);
    expect(allStudents.body[prevStudentsLength].email).toBe(newStudent.email);

    const newUsers = await User.findAll();
    expect(newUsers.length).toBe(prevUsersLength + 1);
    expect(newUsers[prevUsersLength].relatedId).toBe(11);
    done();
  }, 10000);
});
