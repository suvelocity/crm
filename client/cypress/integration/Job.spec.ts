import {
  fillForm,
  expectFormErrors,
  startWithAdminRefreshToken,
} from "../testhelpers/helpers";
import { jobFormErrorTitles } from "../testhelpers/errorTitles";
import { jobInputs } from "../testhelpers/inputs";
import { jobTestMock } from "../testhelpers/mocks";

describe("Job Tests", () => {
  beforeEach(() => {
    startWithAdminRefreshToken();
  });

  it("tests add job form", () => {
    cy.route("GET", "**/api/v1/company/all", [
      {
        id: 2,
        name: "Facebook",
        contactName: "Doron Alon",
        contactNumber: "0523485940",
        contactPosition: "CEO",
        location: "Tel Aviv, Israel",
        description: "A social network corporation.",
        createdAt: "2020-12-14T07:17:35.000Z",
        updatedAt: "2020-12-14T07:17:35.000Z",
        deletedAt: null,
      },
      {
        id: 3,
        name: "Microsoft",
        contactName: "Nitzan Nir",
        contactNumber: "0545545033",
        contactPosition: "Head recruiter",
        location: "Herzliya, Israel",
        description:
          "Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services. ",
        createdAt: "2020-12-14T07:21:32.000Z",
        updatedAt: "2020-12-14T07:21:54.000Z",
        deletedAt: null,
      },
    ]).as("companies");
    cy.route("POST", "**/api/v1/job", {
      message: "ok",
    }).as("submit");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });

    cy.visit("http://localhost:3000/job/add");
    cy.wait("@companies");
    expectFormErrors(jobFormErrorTitles);
    fillForm(jobInputs);
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/job/all");
  });

  it("tests Edit Job information", () => {
    const { students, job } = jobTestMock;
    cy.route("GET", "**/api/v1/student/all", students).as("students");
    cy.route("GET", "**/api/v1/job/byId/3?only=jobs", job).as("job");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.route("GET", "**/api/v1/company/all", [
      {
        id: 2,
        name: "Facebook",
        contactName: "Doron Alon",
        contactNumber: "0523485940",
        contactPosition: "CEO",
        location: "Tel Aviv, Israel",
        description: "A social network corporation.",
        createdAt: "2020-12-14T07:17:35.000Z",
        updatedAt: "2020-12-14T07:17:35.000Z",
        deletedAt: null,
      },
      {
        id: 3,
        name: "Microsoft",
        contactName: "Nitzan Nir",
        contactNumber: "0545545033",
        contactPosition: "Head recruiter",
        location: "Herzliya, Israel",
        description:
          "Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services. ",
        createdAt: "2020-12-14T07:21:32.000Z",
        updatedAt: "2020-12-14T07:21:54.000Z",
        deletedAt: null,
      },
    ]).as("companies");
    cy.route("PATCH", "**/api/v1/job/3", {
      message: "ok",
    }).as("update");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });

    cy.visit("http://localhost:3000/job/3");
    cy.wait("@job");
    cy.get("#editJobButton").click();
    fillForm(jobInputs, true);
    cy.wait("@update");
    cy.wait("@job");
    cy.wait("@students");
  });

  it("should be able to add students for job", () => {
    const { students, job } = jobTestMock;
    cy.route("GET", "**/api/v1/student/all", students).as("students");
    cy.route("GET", "**/api/v1/job/byId/3?only=jobs", job).as("job");
    cy.route("POST", "**/api/v1/event", {}).as("apply");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.visit("http://localhost:3000/job/3");
    cy.wait("@job");
    cy.wait("@students");
    cy.get("#assignStudent").click();
    cy.get("#20").click();
    cy.get("#apply").click();
    cy.wait("@apply");
    cy.wait("@job");
  });
});
