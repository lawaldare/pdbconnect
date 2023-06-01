describe('lib-docs', () => {
  beforeEach(() => cy.visit('/iframe.html?id=libdocscomponent--primary'));
  it('should render the component', () => {
    cy.get('pdbc-lib-docs').should('exist');
  });
});
