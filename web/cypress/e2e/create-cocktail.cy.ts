import { v4 as uuid } from "uuid";

describe("Create a cocktail", () => {
  it("allows a user to create a new cocktail", () => {
    // Arrange
    cy.visit("/");
    cy.login("write");
    cy.intercept(
      {
        method: "POST",
        url: "/cocktails",
      },
      {
        statusCode: 201,
        body: {
          id: uuid(),
          name: "Mojito",
          ingredients: ["Rum", "Coke", "Lime"],
        },
      }
    );
    // Act
    cy.get('button[aria-label="Create cocktail"]').click();
    cy.get("input[name=name]").type("Mojito");
    cy.get("input[name='ingredients.0.name']").type("Rum{enter}");
    cy.get("input[name='ingredients.1.name']").type("Coke{enter}");
    cy.get("input[name='ingredients.2.name']").type("Lime{enter}");
    cy.get("button[name=create]").click();

    // Assert
    cy.contains("New cocktail created");
  });
});
