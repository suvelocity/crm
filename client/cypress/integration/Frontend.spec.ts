import {
  fillForm,
  expectFormErrors,
  startWithAdminRefreshToken,
} from "../testhelpers/helpers";
import {
  jobFormErrorTitles,
  companyFormErrorTitles,
  classFormErrorTitles,
  studentFormErrorTitles,
} from "../testhelpers/errorTitles";
import {
  jobInputs,
  studentInputs,
  companyInputs,
  classInputs,
} from "../testhelpers/inputs";
import { studentTestMocks, jobTestMock } from "../testhelpers/mocks";
describe("Auth Tests", () => {
  beforeEach(() => {
    startWithAdminRefreshToken();
  });

  it("Tests Login", () => {
    cy.route("POST", "**/api/v1/auth/signin", {
      userType: "admin",
    }).as("login");
    cy.visit("http://localhost:3000");
    cy.get("#email").type("Admin@admin.com");
    cy.get("#password").type("Admin@admin.com");
    cy.get("#login").click();
    cy.wait("@login");
    cy.contains("Welcome to CRM");
  });
});

describe("Student Tests", () => {
  beforeEach(() => {
    startWithAdminRefreshToken();
  });

  it("tests add student form", () => {
    cy.route("POST", "**/api/v1/student", {
      message: "ok",
    }).as("submit");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.route("GET", "**/api/v1/class/all", [
      {
        id: 6,
        course: "Cyber4s",
        name: "Cyber4s",
      },
      {
        id: 7,
        course: "Adva",
        name: "Bareket",
      },
    ]);

    cy.visit("http://localhost:3000/student/add");
    expectFormErrors(studentFormErrorTitles);
    fillForm(studentInputs);
    cy.get("#submitButton").click({ force: true });
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/student/all");
  });

  it("should be able to add jobs for student", () => {
    const { student, jobs } = studentTestMocks;
    cy.route("GET", "**/api/v1/job/all", jobs).as("jobs");
    cy.route("GET", "**/api/v1/student/byId/9?only=jobs", student).as(
      "student"
    );
    cy.route("POST", "**/api/v1/event").as("apply");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.visit("http://localhost:3000/student/9");
    cy.wait("@student");
    cy.wait("@jobs");
    cy.get("#applyForJob").click();
    cy.get("#3").click();
    cy.get("#apply").click();
    cy.wait("@apply");
    cy.wait("@student");
  });
});

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

  it("should be able to add students for job", () => {
    const { students, job } = jobTestMock;
    cy.route("GET", "**/api/v1/student/all", students).as("students");
    cy.route("GET", "**/api/v1/job/byId/3", job).as("job");
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

describe("Class tests", () => {
  beforeEach(() => {
    startWithAdminRefreshToken();
  });

  it("tests add class form", () => {
    cy.route("POST", "**/api/v1/class", {
      message: "ok",
    }).as("submit");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });

    cy.visit("http://localhost:3000/class/add");
    expectFormErrors(classFormErrorTitles);
    fillForm(classInputs);
    cy.get("#submitButton").click();
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/class/all");
  });
});

describe("Company tests", () => {
  beforeEach(() => {
    startWithAdminRefreshToken();
  });

  it("tests add company form", () => {
    cy.route("POST", "**/api/v1/company", {
      message: "ok",
    }).as("submit");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });

    cy.visit("http://localhost:3000/company/add");
    expectFormErrors(companyFormErrorTitles);
    fillForm(companyInputs);
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/company/all");
  });
});
