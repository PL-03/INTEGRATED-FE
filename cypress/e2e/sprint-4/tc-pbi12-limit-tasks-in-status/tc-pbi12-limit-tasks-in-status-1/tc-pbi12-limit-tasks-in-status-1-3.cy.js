describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-1-3\n 
          Test Scenario : normal - limit disabled\n
           -enable then disable limit\n
           -step 2`, () => {
  
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

    it('************************* STEP 2 *******************************',()=>{        
    })

    it('The limit tasks in status should be unchecked and click to enable the limit tasks in status with saving',()=>{
        cy.get('.itbkk-status-setting').should('exist').click() ;
        cy.wait(100) ;
        cy.get('.itbkk-limit-task').should('not.be.checked') ;
        cy.get('.itbkk-limit-task').check({force: true}) ;

        cy.get('.itbkk-button-confirm').click()
    })    

    it('The limit tasks in status should be checked and click to uncheck for disabling the limit tasks in status with saving',()=>{
        cy.get('.itbkk-status-setting').should('exist').click() ;
        cy.wait(100) ;
        cy.get('.itbkk-limit-task').should('be.checked') ;
        cy.get('.itbkk-limit-task').uncheck({force: true}) ;

        cy.get('.itbkk-button-confirm').click()
    })    

    it('The limit tasks in status should be unchecked and click the cancel button to return the staus list page',()=>{
        cy.get('.itbkk-status-setting').should('exist').click() ;
        cy.wait(100) ;
        cy.get('.itbkk-limit-task').should('not.be.checked') ;

        cy.get('.itbkk-button-cancel').click()

        cy.url().should('contain','/task')
    })    

})