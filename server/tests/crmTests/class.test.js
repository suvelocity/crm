//@ts-ignore
import { Student, Class } from "../../src/models";
import { classesMock, studentsMock } from "../mocks";
import {
  deleteById,
  extractAccessTokenFull,
  getAll,
  getById,
  handleSignIn,
  patchById,
  post,
} from "../testsHelpers";
import server from "../../src/app";
import { classesTestExpectedResults } from "../mocks/classes/classesTestExpectedResults";

let accessToken;

const getCurrentClasses = async () => await getAll("class", accessToken);
const getClassById = async (id) => await getById(id, "class", accessToken);
const postNewClass = async (body) => await post("class", accessToken, body);
const patchClassById = async (id, body) =>
  await patchById(id, "class", accessToken, body);
const deleteClassById = async (id) =>
  await deleteById(id, "class", accessToken);

const mockAddedClass = {
  id: 7,
  course: "full stack",
  name: "Test",
  startingDate: "2020-07-05",
  endingDate: "2020-12-31",
  cycleNumber: 1,
  zoomLink: "www.zoom.com",
  additionalDetails: "none",
  mentorProject: false,
  createdAt: "2020-12-20",
  updatedAt: "2020-12-20",
};

const mockUpdate = {
  course: " staupdateck",
  name: "update Test",
  startingDate: "2020-06-05",
  endingDate: "2020-10-31",
  cycleNumber: 1,
  zoomLink: "www.notzoom.com",
  additionalDetails: "Amir is snake",
};

describe("Class tests", () => {
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

  it("Should get all classes", async () => {
    const allClasses = await getCurrentClasses();

    expect(allClasses.status).toBe(200);
    expect(allClasses.body.length).toBe(6);

    for (let i in allClasses.body) {
      expect(allClasses.body[i].id).toBe(classesTestExpectedResults[i].id);
      expect(allClasses.body[i].position).toBe(
        classesTestExpectedResults[i].position
      );
    }
  });

  it("Should get a class by id", async () => {
    const id = 2;
    const singleClass = await getClassById(id);

    expect(singleClass.status).toBe(200);
    expect(singleClass.body.id).toBe(id);
    expect(singleClass.body.position).toBe(
      classesTestExpectedResults.find((cter) => cter.id === id).position
    );
  });

  it("Should add a class", async () => {
    const addedClass = await postNewClass(mockAddedClass);
    expect(addedClass.status).toBe(200);
    for (let field in addedClass.body) {
      if (
        ["createdAt", "updatedAt", "startingDate", "endingDate"].includes(field)
      ) {
        expect(addedClass.body[field].slice(0, 10)).toBe(mockAddedClass[field]);
      } else {
        expect(addedClass.body[field]).toBe(mockAddedClass[field]);
      }
    }
  });

  it("Should update all fields of class", async () => {
    const id = 2;
    const updatedClassMSG = await patchClassById(id, mockUpdate);

    expect(updatedClassMSG.status).toBe(200);
    expect(updatedClassMSG.body.message).toBe("Class updated");

    const { body: updatedClass } = await getClassById(id);

    for (let field in mockUpdate) {
      if (["startingDate", "endingDate"].includes(field)) {
        expect(updatedClass[field].slice(0, 10)).toBe(mockUpdate[field]);
      } else {
        expect(updatedClass[field]).toBe(mockUpdate[field]);
      }
    }
  });

  it("Should delete a job", async () => {
    const id = 1;

    const preDeletedClass = await getClassById(id);
    const deletedClassMsg = await deleteClassById(id);
    const postDeletedClass = await getClassById(id);

    expect(preDeletedClass.deletedAt).toBe(undefined);
    expect(deletedClassMsg.status).toBe(200);
    expect(deletedClassMsg.body.message).toBe("Class deleted");
    expect(postDeletedClass.status).toBe(404);
    expect(postDeletedClass.body.error).toBe("Class not found");
  });
});
