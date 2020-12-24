import{ startWithAdminRefreshToken } from "../testhelpers/helpers";
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