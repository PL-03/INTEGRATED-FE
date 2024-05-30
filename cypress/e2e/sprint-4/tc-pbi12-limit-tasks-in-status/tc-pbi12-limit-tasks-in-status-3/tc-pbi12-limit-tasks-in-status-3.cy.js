describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-3\n 
          Test Scenario : normal - disable limit\n
           -delete status and transfer to > limit status
           -run this test with your advisor`, () => {
  
    beforeEach(()=> {
        cy.visit('/task') ;
        cy.wait(100) ;
    }) ;

    it('Run this test with your advisor.', () => {
        cy.get('.run.this.test.with.your.advisor').should('exist') ;
    })

})