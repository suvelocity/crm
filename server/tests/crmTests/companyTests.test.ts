import request from "supertest";
import {
  handleSignIn,
  extractRefreshToken,
  extractRefreshTokenFull,
  extractAccessTokenFull,
  sendRequest,
  toCamelCase,
  getAll
} from "../testsHelpers";
import {
  companyMock,
  studentsTestExpectedResult,
  newStudent
} from "../mocks";
//@ts-ignore
import { Company, Class, User } from "../../src/models";

let accessToken: string;
    
  const getCurrentCompanies = async () => await getAll('company', accessToken)



  const compareProperties = (arg1:object, arg2:object, properties:string[]) => 
  properties.forEach((prop: string) => {
    expect(arg1[prop]).toBe(arg2[prop])
  });

describe("Company Tests", () => {
  beforeAll(async () => {
    await Company.destroy({ truncate: true, force: true });
    await Company.bulkCreate(companyMock);
    const authAdmin = await handleSignIn("admin");
    accessToken = extractAccessTokenFull(authAdmin);
  });

  test.only("Admin should be able to get all student`s information", async (done) => {
    const allCompanies = await getCurrentCompanies()
    expect(allCompanies.status).toBe(200);
    expect(allCompanies.body.length).toBe(companyMock.length);
    for (let i = 0; i < companyMock.length; i++) {
      compareProperties(companyMock[i], allCompanies.body[i],
        ['id', 'name', 'location', 'description', 'contactName',
      'contactNumber', 'contactPosition'])
    }
    done();
  });

  test("Admin should be able to get one student`s information", async (done) => {
    for (let i = 1; i < 11; i++) {
      const student = await getStudentById(i)
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
    const prevStudent = await getStudentById(1)
    expect(prevStudent.body.additionalDetails).toBe("single");

    const student = await patchStudentById(1, { additionalDetails: "lol" })
    expect(student.status).toBe(200);
    expect(student.body).toEqual({ message: "Student updated" });

    const newStudent = await getStudentById(1)
    expect(newStudent.body.additionalDetails).toBe("lol");
    done();
  });

  test("Admin should be able to delete", async (done) => {
    const prevStudents = await getCurrentStudents()
    expect(prevStudents.body.length).toBe(10);

    const prevStudent = await getStudentById(1)
    expect(prevStudent.status).toBe(200);

    const deletedStudent = await deleteStudentById(1)
    expect(deletedStudent.status).toBe(200);
    expect(deletedStudent.body).toEqual({ message: "Student deleted" });

    const newStudents = await getCurrentStudents()
    expect(newStudents.body.length).toBe(9);

    const notGonnaBeFoundStudent = await getStudentById(1)
    expect(notGonnaBeFoundStudent.status).toBe(404);
    done();
  });
  test("admin should be able to add a student and user", async (done) => {
    const prevStudents = await getCurrentStudents()

    const prevUsers = await User.findAll();
    const prevUsersLength = prevUsers.length;
    const prevStudentsLength = prevStudents.body.length;

    const postedStudent = await sendRequest('post', `/student`,
     accessToken, { ...newStudent, id: 100 })
    expect(postedStudent.status).toBe(200);
    expect(postedStudent.body.email).toBe(newStudent.email);
    
    const allStudents = await getCurrentStudents()
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
