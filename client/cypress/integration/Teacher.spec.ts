import {
    fillForm,
    expectFormErrors,
    startWithAdminRefreshToken,
  } from "../testhelpers/helpers";
  import { teacherFormErrorTitles } from "../testhelpers/errorTitles";
  import { teacherInputs } from "../testhelpers/inputs";
  import { teacherTestMocks } from "../testhelpers/mocks";
  
  describe("Teacher tests", () => {
    beforeEach(() => {
      startWithAdminRefreshToken();
    });
  
    it("tests add Teacher form", () => {
      cy.route("POST", "**/api/v1/teacher", {
        message: "ok",
      }).as("submit");
      cy.route("POST", "**/api/v1/auth/token", {
        userType: "admin",
      });
  
      cy.visit("http://localhost:3000/teacher/add");
      expectFormErrors(teacherFormErrorTitles);
      fillForm(teacherInputs);
      cy.get("#submitButton").click();
      cy.wait("@submit");
      cy.url().should("equal", "http://localhost:3000/teacher/all");
    });
  
    it("tests Edit Teacher information", () => {
      const { teacher } = teacherTestMocks;
      cy.route("GET", "**/api/v1/teacher/byId/3", teacher).as(
        "teacher"
      );
      cy.route("PATCH", "**/api/v1/teacher/3", {
        message: "ok",
      }).as("update");
      cy.route("POST", "**/api/v1/auth/token", {
        userType: "admin",
      });
      cy.visit("http://localhost:3000/teacher/3");
      cy.wait("@teacher");
      cy.get("#editTeacherButton").click();
      fillForm(teacherInputs, true);
      cy.get("#submitButton").click();
      cy.wait("@update");
      cy.wait("@teacher");
    });

    it("should be able to add Class to Teacher", () => {
        const { teacher, addedClass } = teacherTestMocks;
        cy.route("GET", "**/api/v1/teacher/byId/3", teacher).as("teacher");
        cy.route("GET", "**/api/v1/class/all", [addedClass]).as("newclass");
        cy.route("POST", "**/api/v1/teacher/addClassToTeacher", {}).as("assign");
        cy.route("POST", "**/api/v1/auth/token", {
          userType: "admin",
        });
        cy.visit("http://localhost:3000/teacher/3");
        cy.wait("@teacher");
        cy.get("#assignTeacher").click();
        cy.wait('@newclass')
        cy.get(`#${addedClass.id}`).click();
        cy.get("#assign").click();
        cy.wait("@assign");
        cy.wait("@teacher");
      });
  });
  