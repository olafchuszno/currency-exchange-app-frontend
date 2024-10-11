describe('e2e', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display the initial exchange rate', () => {
    cy.get('[data-cy="exchange-rate"]')
      .should('exist')
      .invoke('text')
      .should('not.be.empty');
  });

  it('should convert the currency', async () => {
    cy.get('[data-cy="exchange-rate"]')
      .should('exist')
      .invoke('text')
      .should('not.be.empty')
      .then((currencyRateFromApi) => {
        const numericCurrencyRateFromApi = parseFloat(currencyRateFromApi.trim());

        // Type amount
        cy.get('[name="amount-in-euro"]').type('100');

        // Start calculator
        cy.contains('Check amount in PLN').click();

        // Get the calculated amount
        cy.get('[data-cy="converted-currency-rate"]')
          .should('exist')
          .invoke('text')
          .then((convertedRate) => {
            const numericConvertedRate = parseFloat(convertedRate.trim());
            
            // Assert whether calculated amount is right - wrap cause in async code
            cy.wrap(numericConvertedRate).should('equal', Math.round(numericCurrencyRateFromApi * 100 * 100) / 100)
          });
      });
  });
});
