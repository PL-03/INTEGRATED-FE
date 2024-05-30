describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-1\n 
          Test Scenario : normal - limit disabled\n
           -delete status and transfer > limit\n
           -step 7`, () => {
  
    beforeEach(()=> {
        cy.visit('/task') ;
        cy.wait(100) ;
    }) ;

    it('Run this test with your advisor.', () => {
        cy.get('.run.this.test.with.your.advisor').should('exist') ;
    })

    it('************************* STEP 7 *******************************', () => {
        cy.get('.run.this.test.with.your.advisor').should('exist') ;
    })

})