it('fetches pokemons and adds them to favourites', () => {
  cy.visit('http://localhost:3000');

  // test error response from Pokemon API
  cy.intercept('https://pokeapi.co/api/v2/pokemon-species/*', {
    statusCode: 500,
  }).as('pokemonRequest');

  cy.getByTestId('input-search').type('wormadam');
  cy.getByTestId('button-submit').click();
  cy.wait('@pokemonRequest');

  cy.contains("There's been an error searching for your pokemon...");

  // test error response from Shakesperean API
  cy.intercept('https://pokeapi.co/api/v2/pokemon-species/*', {
    fixture: 'pokemon-response.json',
    statusCode: 200,
  }).as('pokemonRequest');
  cy.intercept('https://api.funtranslations.com/translate/shakespeare.json', {
    statusCode: 500,
  }).as('shakespeareanRequest');

  cy.getByTestId('input-search').type('wormadam');
  cy.getByTestId('button-submit').click();
  cy.wait('@pokemonRequest');
  cy.wait('@shakespeareanRequest');

  cy.contains("There's been an error searching for your pokemon...");

  // test pokemon not found
  cy.intercept('https://pokeapi.co/api/v2/pokemon-species/*', {
    statusCode: 404,
  }).as('pokemonRequest');

  cy.getByTestId('input-search').type('wormadam');
  cy.getByTestId('button-submit').click();
  cy.wait('@pokemonRequest');

  cy.contains("Couldn't find your pokemon...");

  // test pokemon found successfully
  cy.intercept('https://pokeapi.co/api/v2/pokemon-species/*', {
    fixture: 'pokemon-response.json',
    statusCode: 200,
  }).as('pokemonRequest');
  cy.intercept('https://api.funtranslations.com/translate/shakespeare.json', {
    fixture: 'shakespearean-response.json',
    statusCode: 200,
  }).as('shakespeareanRequest');

  cy.getByTestId('input-search').type('wormadam');
  cy.getByTestId('button-submit').click();

  cy.wait('@pokemonRequest');
  cy.wait('@shakespeareanRequest');

  cy.contains('wormadam');
  cy.contains('At which hour burmy evolved');

  // test adding pokemon to favorites
  cy.getByTestId('button-favorite').click();
  cy.contains('Favorites (1)');

  cy.getByTestId('nav-link-favorites').click();
  cy.url().should('contain', 'favorites');
  cy.contains('wormadam');

  // test persisting favorited pokemons
  cy.reload();
  cy.contains('Favorites (1)');
  cy.contains('wormadam');

  // test displaying favorited pokemons
  cy.getByTestId('link-favorite-wormadam').click();
  cy.url().should('not.contain', '/favorites');
  cy.contains('wormadam');
  cy.contains('At which hour burmy evolved');

  // test unfavoriting pokemons
  cy.getByTestId('button-favorite').click();
  cy.contains('Favorites (0)');
  cy.getByTestId('nav-link-favorites').click();
  cy.url().should('contain', 'favorites');
  cy.should('not.contain', 'wormadam');
  cy.contains("You haven't favorited any pokemons yet");
});

it('works with keyboard navigation', () => {
  cy.visit('http://localhost:3000');

  cy.get('body').realClick(); // this brings the focus to the iFrame with our application running

  // Search for a pokemon
  cy.realPress('Tab');
  cy.realPress('Tab');
  cy.realPress('Tab');

  cy.intercept('https://pokeapi.co/api/v2/pokemon-species/*', {
    fixture: 'pokemon-response.json',
  }).as('pokemonRequest');
  cy.intercept('https://api.funtranslations.com/translate/shakespeare.json', {
    fixture: 'shakespearean-response.json',
  }).as('shakespeareanRequest');

  cy.focused().type('wormadam');
  cy.realPress('Tab');
  cy.realPress('Enter');

  cy.contains('wormadam');
  cy.contains('At which hour burmy evolved');

  // Add pokemon to favorites
  cy.realPress('Tab');
  cy.realPress('Enter');

  cy.contains('Favorites (1)');

  // Go to the favorites section
  cy.realPress(['Shift', 'Tab']);
  cy.realPress(['Shift', 'Tab']);
  cy.realPress(['Shift', 'Tab']);

  cy.realPress('Enter');
  cy.contains('Favorited pokemons');

  // Display favorited pokemon
  cy.realPress('Tab');
  cy.realPress('Enter');

  cy.contains('wormadam');
  cy.contains('At which hour burmy evolved');

  // Remove pokemon from favorites
  cy.realPress('Tab');
  cy.realPress('Tab');
  cy.realPress('Tab');
  cy.realPress('Enter');

  cy.contains('Favorites (0)');
});
