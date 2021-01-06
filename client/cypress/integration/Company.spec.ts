import {
  fillForm,
  expectFormErrors,
  startWithAdminRefreshToken,
} from "../testhelpers/helpers";
import { companyFormErrorTitles } from "../testhelpers/errorTitles";
import { companyInputs } from "../testhelpers/inputs";
import { companyTestMocks } from "../testhelpers/mocks";

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

  it("tests Edit company information", () => {
    const { company } = companyTestMocks;
    cy.route("GET", "**/api/v1/company/byId/2", company).as(
      "company"
    );
    cy.route("PATCH", "**/api/v1/company/2", {
      message: "ok",
    }).as("update");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.visit("http://localhost:3000/company/2");
    cy.wait("@company");
    cy.get("#editCompanyButton").click();
    fillForm(companyInputs, true);
    cy.wait("@update");
    cy.wait("@company");
  });
});
