import { v4 as uuid } from "uuid";

describe("Login", () => {
  it("allows the user to add their valid api key", () => {
    cy.login("write");
  });

  it("rejects an invalid api key", () => {
    // Arrange
    const apiKey = uuid();
    cy.intercept(`/api-keys/${apiKey}`, {
      statusCode: 404,
      body: { message: "API key not found" },
    });

    // Act
    cy.visit("/");
    cy.get("input[name=key]").type(`${apiKey}`);
    cy.get("button[type=submit").click();

    // Assert
    cy.contains("Invalid key");
  });
});
