/// <reference types="cypress" />
import "./commands";
import "cypress-real-events/support";

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
