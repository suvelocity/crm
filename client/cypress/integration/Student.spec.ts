import {
    fillForm,
    expectFormErrors,
    startWithAdminRefreshToken,
  } from "../testhelpers/helpers";
import { studentFormErrorTitles } from "../testhelpers/errorTitles";
import { studentInputs} from "../testhelpers/inputs";
import { studentTestMocks } from "../testhelpers/mocks";

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
  
    it("tests Edit student information", () => {
      const { student, jobs } = studentTestMocks;
      cy.route("GET", "**/api/v1/student/byId/9?only=jobs", student).as(
        "student"
      );
      cy.route("GET", "**/api/v1/job/all", jobs).as("jobs");
      cy.route("PATCH", "**/api/v1/student/9", {
        message: "ok",
      }).as("update");
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
      cy.visit("http://localhost:3000/student/9");
      cy.wait("@student");
      cy.get("#editStudentButton").click();
      fillForm(studentInputs, true);
      cy.get("#submitButton").click({ force: true });
      cy.wait("@update");
      cy.wait("@student");
      cy.wait("@jobs");
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
