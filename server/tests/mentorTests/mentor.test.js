//@ts-ignore
import { Mentor } from "../../src/models";
import supertest from "supertest";
import { mentorsMock} from "../mocks";
import {
  extractAccessTokenFull,
  handleSignIn,
} from "../testsHelpers";
import app from "../../src/app";
const request = supertest(app)
let accessToken;

const mockAddedMentor =  {
    name: "Mentor",
    company: "Company",
    email: "mentor@mentor.com",
    phone: "1234567890",
    address:"Tel Aviv, Israel",
    role: "full stack developer",
    experience: 10,
    gender: "male",
    available:true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
const mockUpdate = {
    name: "Mentor2",
    company: "Company2",
    email: "mentor1@mentor1.com",
    phone: "0521111222",
    address:"Holon, Israel",
    role: "QA Tester",
    experience: 5,
    gender: "female",
};

describe("Mentors tests", () => {
  beforeAll(async () => {
    await Mentor.destroy({ truncate: true, force: true });
    await Mentor.bulkCreate(mentorsMock);
    const authAdmin = await handleSignIn("admin");
    accessToken = extractAccessTokenFull(authAdmin);
  });
  afterAll(async () => {
    await server.close();
  });

  it("Should get all mentors", async () => {
    const allMentors = await request.get('Api/V1/M/mentor').set("authorization", `bearer ${accessToken}`);
    expect(allMentors.status).toBe(200);
    expect(allMentors.body.length).toBe(mentorsMock.length);

    for (let i in allMentors.body) {
      expect(allMentors.body[i].id).toBe(mentorsMock[i].id);
    }
  });
  it("Should get all available mentors", async () => {
    const allAvailableMentors = await request.get('Api/V1/M/mentor/available').set("authorization", `bearer ${accessToken}`);
    expect(allAvailableMentors.status).toBe(200);
    expect(allAvailableMentors.body.length).toBe(3);
  });

  it("Should get a mentor by id", async () => {
    const id = 2;
    const singleMentor = await request.get(`Api/V1/M/mentor/${id}`).set("authorization", `bearer ${accessToken}`);

    expect(singleMentor.status).toBe(200);
    expect(singleMentor.body.id).toBe(id);
    expect(singleMentor.body.name).toBe(
        mentorsMock.find((mentor) => mentor.id === id).name
    );
  });

  it("Should add a mentor", async () => {
    const addedMentor = await request.post(`Api/V1/M/mentor/`).set("authorization", `bearer ${accessToken}`).send(mockAddedMentor);
    expect(addedMentor.status).toBe(200);
    const allMentors = await request.get('Api/V1/M/mentor').set("authorization", `bearer ${accessToken}`);
    expect(allMentors.body.length).toBe(mentorsMock.length + 1)
    expect(allMentors.body[-1].name).toBe(mockAddedMentor.name)
  });

  it("Should update all fields of mentor", async () => {
    const id = 2;
    const updatedMentor = await request.put(`Api/V1/M/mentor/${id}`).set("authorization", `bearer ${accessToken}`).send(mockUpdate);
    expect(updatedMentor.status).toBe(200);
    expect(updatedMentor.body.message).toBe("Mentor updated");
    const singleMentor = await request.get(`Api/V1/M/mentor/${id}`).set("authorization", `bearer ${accessToken}`);
    for(let key in mockUpdate){
        expect(singleMentor.body[key]).to.equal(mockUpdate[key]);
    }

  });

  it("Should delete a mentor", async () => {
    const id = 1;

    const preDeletedMentors = await request.get(`Api/V1/M/mentor/${id}`).set("authorization", `bearer ${accessToken}`);
    const deletedMentor = await request.patch('Api/V1/M/mentor/dalete').set("authorization", `bearer ${accessToken}`).send({mentorId:id});
    const postDeletedMentors =await request.get(`Api/V1/M/mentor/${id}`).set("authorization", `bearer ${accessToken}`);

    expect(preDeletedMentors.deletedAt).toBe(undefined);
    expect(deletedMentor.status).toBe(200);
    expect(deletedMentor.body.message).toBe("Mentor deleted");
    expect(postDeletedMentors.status).toBe(500);
  });
});
