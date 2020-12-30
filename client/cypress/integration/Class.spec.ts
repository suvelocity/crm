import {
    fillForm,
    expectFormErrors,
    startWithAdminRefreshToken,
  } from "../testhelpers/helpers";
import { classFormErrorTitles } from "../testhelpers/errorTitles";
import { classInputs} from "../testhelpers/inputs";
import { classTestMocks } from "../testhelpers/mocks";

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
  
    it("tests Edit class information", () => {
      const { oneClass } = classTestMocks;
      cy.route("GET", "**/api/v1/class/byId/6", oneClass).as(
        "class"
      );
      cy.route("PATCH", "**/api/v1/class/6", {
        message: "ok",
      }).as("update");
      cy.route("POST", "**/api/v1/auth/token", {
        userType: "admin",
      });
      cy.visit("http://localhost:3000/class/6");
      cy.wait("@class");
      cy.get("#editClassButton").click();
      fillForm(classInputs, true);
      cy.get("#submitButton").click({ force: true });
      cy.wait("@update");
      cy.wait("@class");
    });
});