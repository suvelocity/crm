//@ts-ignore
import { Mentor, MentorProgram, Class, MentorStudent, Student} from "../../src/models";
import supertest from "supertest";
import { mentorsMock, programsMock, classesMock, pairsMock, studentsMock } from "../mocks";
import {
  extractAccessTokenFull,
  handleSignIn,
} from "../testsHelpers";
import app from "../../src/app";
const request = supertest(app)
let accessToken;

const mockAddedProgram = {
    class_id: 2,
    name: "seed M-program" ,
    start_date: new Date(),
    end_date: new Date("2021-05-16"),
    open:true,
    created_at: new Date(),
    updated_at: new Date(),
  };
const mockUpdate = {
    name: "seed M-program -change" ,
    start_date: new Date("2023-01-16"),
    end_date: new Date("2023-07-16"),
    open:false,
  };

describe("Program tests", () => {
  beforeAll(async () => {
    await Mentor.destroy({ truncate: true, force: true });
    await MentorProgram.destroy({ truncate: true, force: true });
    await Class.destroy({ truncate: true, force: true });
    await MentorStudent.destroy({ truncate: true, force: true });
    await Mentor.bulkCreate(mentorsMock);
    await MentorProgram.bulkCreate(programsMock);
    await Class.bulkCreate(classesMock);
    await MentorStudent.bulkCreate(pairsMock);
    const authAdmin = await handleSignIn("admin");
    accessToken = extractAccessTokenFull(authAdmin);
  });
  afterAll(async () => {
    await server.close();
  });

  it("Should get all programs", async () => {
    const allPrograms = await request.get('Api/V1/M/program/all').set("authorization", `bearer ${accessToken}`);
    expect(allPrograms.status).toBe(200);
    expect(allPrograms.body.length).toBe(programsMock.length);

    for (let i in allMentors.body) {
      expect(allMentors.body[i].id).toBe(programsMock[i].id);
    }
  });

  it("Should get a program by id", async () => {
    const id = 1;
    const singleProgram = await request.get(`Api/V1/M/program/${id}`).set("authorization", `bearer ${accessToken}`);

    expect(singleProgram.status).toBe(200);
    expect(singleProgram.body.id).toBe(id);
    expect(singleProgram.body.name).toBe(
        programsMock.find((program) => program.id === id).name
    );
  });

  it("Should add a program", async () => {
    const addedProgram = await request.post(`Api/V1/M/program/`).set("authorization", `bearer ${accessToken}`).send(mockAddedProgram);
    expect(addedProgram.status).toBe(200);
    const allPrograms = await request.get('Api/V1/M/program/all').set("authorization", `bearer ${accessToken}`);
    expect(allPrograms.body.length).toBe(programsMock.length + 1)
    expect(allPrograms.body[-1].name).toBe(mockAddedProgram.name)
  });

  it("Should update all fields of program", async () => {
    const id = 1;
    const updatedProgram = await request.put(`Api/V1/M/program/${id}`).set("authorization", `bearer ${accessToken}`).send(mockUpdate);
    expect(updatedProgram.status).toBe(200);
    expect(updatedProgram.body.message).toBe("Program updated");
    const singleProgram = await request.get(`Api/V1/M/program/${id}`).set("authorization", `bearer ${accessToken}`);
    for(let key in mockUpdate){
        expect(singleProgram.body[key]).to.equal(mockUpdate[key]);
    }
  });

  it("Should delete a program", async () => {
    const id = 1;
    const preDeletedPrograms = await request.get(`Api/V1/M/program/${id}`).set("authorization", `bearer ${accessToken}`);
    const deletedPrograms = await request.patch('Api/V1/M/program/dalete').set("authorization", `bearer ${accessToken}`).send({mentorId:id});
    const postDeletedPrograms =await request.get(`Api/V1/M/program/${id}`).set("authorization", `bearer ${accessToken}`);

    expect(preDeletedPrograms.deletedAt).toBe(undefined);
    expect(deletedPrograms.status).toBe(200);
    expect(postDeletedPrograms.body.message).toBe("Program deleted");
    expect(postDeletedPrograms.status).toBe(500);
  });
});