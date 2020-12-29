import request from "supertest";
import {
  handleSignIn,
  extractRefreshToken,
  extractRefreshTokenFull,
  extractAccessTokenFull,
  sendRequest,
  toCamelCase,
  getAll,
  getById,
  patchById,
  deleteById
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
  const getCompanyById = async (id: number) =>await getById(id, "company", accessToken);
  const patchCompanyById = async (id: number, body: object) => await patchById(id, "company", accessToken, body);
  const deleteCompanyById = async (id: number) => await deleteById(id, "company", accessToken);

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

  test("Admin should be able to get all Company's information", async (done) => {
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

  test("Admin should be able to get one Company`s information", async (done) => {
    for (let i = 0; i < companyMock.length; i++) {
      const company = await getCompanyById(i+1)
      expect(company.status).toBe(200);
      compareProperties(companyMock[i], company.body,
        ['id', 'name', 'location', 'description', 'contactName',
      'contactNumber', 'contactPosition'])
    }
    done();
  });

  test("Admin should be able to change one Company information", async (done) => {
    const {body: prevCompany} = await getCompanyById(1)
    expect(prevCompany.description).toBe(companyMock[0].description);
    expect(prevCompany.contactName).toBe(companyMock[0].contactName);
    const updatedProperties = {description: 'new description', contactName: 'Wolt'}
    const company = await patchCompanyById(1, updatedProperties)
    expect(company.status).toBe(200);
    expect(company.body).toEqual({ message: "Company updated" });
    const newCompany = await getCompanyById(1)
    for(const key in updatedProperties) {
      expect(newCompany.body[key]).toBe(updatedProperties[key])
    }
    done();
  });

  test("Admin should be able to delete a Company", async (done) => {
    const prevStudents = await getCurrentCompanies()
    expect(prevStudents.body.length).toBe(companyMock.length);

    const prevStudent = await getCompanyById(1)
    expect(prevStudent.status).toBe(200);

    const deletedStudent = await deleteCompanyById(1)
    expect(deletedStudent.status).toBe(200);
    expect(deletedStudent.body).toEqual({ message: "Company deleted" });

    const newStudents = await getCurrentCompanies()
    expect(newStudents.body.length).toBe(companyMock.length -1);

    const notGonnaBeFoundStudent = await getCompanyById(1)
    expect(notGonnaBeFoundStudent.status).toBe(404);
    done();
  });
  test("admin should be able to add a Company", async (done) => {
    const prevCompanies = await getCurrentCompanies()

    const prevCompaniesLength = prevCompanies.body.length;
    const newCompany = { ...companyMock[0], id: prevCompanies.body[prevCompaniesLength - 1].id + 1 }
    const postedCompany = await sendRequest('post', `/company`,
     accessToken, newCompany)
    expect(postedCompany.status).toBe(200);
    compareProperties(newCompany, postedCompany.body, ['id', 'name', 'location', 'description', 'contactName',
    'contactNumber', 'contactPosition'])
    
    const allCompanies = await getCurrentCompanies()
    expect(allCompanies.body.length).toBe(prevCompaniesLength + 1);
    done();
  }, 10000);
});
