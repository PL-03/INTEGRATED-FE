describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-1-1\n 
          Test Scenario : normal - limit disabled`, () => {
  
    beforeEach(()=> {
        cy.visit('/task') ;
        cy.wait(100) ;
    }) ;

    it('Open the task view page at /task', () => {
    })

    it('Table shows Title, Assignees and Status', () => {
        cy.contains('Title') ;
        cy.contains('Assignees') ;
        cy.contains('Status') ;
    })

    it('Task table has 42 task entries.',()=>{
        cy.get('.itbkk-item').should('have.length',42) ;
    })

    it('should have "Status Setting" and click to open the Status Setting',()=>{
        cy.get('.itbkk-status-setting').should('exist').click() ;
    })

    it('The limit tasks in status should be unchecked and click the cancel button to return the status list page',()=>{
        cy.get('.itbkk-status-setting').should('exist').click() ;
        cy.wait(100) ;

        cy.get('.itbkk-limit-task').should('not.be.checked') ;
        cy.get('.itbkk-button-cancel').click()

        cy.url().should('contain','/task')
    })    

})