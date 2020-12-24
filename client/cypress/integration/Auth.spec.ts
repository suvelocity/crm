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

    it.only("Tests Logout", () => {
      cy.route("POST", "**/api/v1/auth/token", {
        userType: "admin",
      });
      cy.route("POST", "**/api/v1/auth/signout", {}).as("logout");
      cy.visit("http://localhost:3000");
      cy.get("#menuButton").click();
      cy.get("#signOut").click();
      cy.wait("@logout");
      cy.getCookie('refreshToken').should('not.exist')
      cy.contains("Scale-Up Velocity CRM");
    });
});