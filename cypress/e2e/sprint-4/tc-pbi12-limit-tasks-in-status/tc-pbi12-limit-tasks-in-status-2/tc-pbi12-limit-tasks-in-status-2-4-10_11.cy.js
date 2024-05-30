describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-2-4\n 
          Test Scenario : normal - limit enabled\n
           -delete status and transfer >= limit
           -step 10 and 11, run this test with your advisor`, () => {
  
    beforeEach(()=> {
        cy.visit('/task') ;
        cy.wait(100) ;
    }) ;

    it('Run this test with your advisor.', () => {
        cy.get('.run.this.test.with.your.advisor').should('exist') ;
    })

    it('************************* STEP 10 *******************************', () => {
        cy.get('.run.this.test.with.your.advisor').should('exist') ;
    })

    it('************************* STEP 11 *******************************', () => {
        cy.get('.run.this.test.with.your.advisor').should('exist') ;
    })

})