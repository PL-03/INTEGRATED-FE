describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-2-2\n 
          Test Scenario : normal - limit enabled\n
           -add/edit task in No Status and Done > limit\n`, () => {
  
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

    it('Task table has 44 task entries.',()=>{
        cy.get('.itbkk-item').should('have.length',44) ;
    })

    it('should have add button and click to open modal',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
    })
    
    it('Add the task "NS11" with "No Status"',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
        cy.wait(100)
    
        cy.get('.itbkk-title').type("NS11")
        cy.get('.itbkk-description').clear()
        cy.get('.itbkk-assignees').clear()
        cy.get('.itbkk-status').select('No Status')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    })
    
    it('Should have task title "NS11" with No Status',()=>{
        cy.get('.itbkk-title').contains('NS11').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"No Status")
    })

    it('"No Status" status has 11 tasks',()=>{
        cy.get('.itbkk-status:contains("No Status")').should('have.length',11) ;
    })

    it('Add the task "DO11" with "Done"',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
        cy.wait(100)
    
        cy.get('.itbkk-title').type("DO11")
        cy.get('.itbkk-description').clear()
        cy.get('.itbkk-assignees').clear()
        cy.get('.itbkk-status').select('Done')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    })
    
    it('Should have task title "DO11" with Done',()=>{
        cy.get('.itbkk-title').contains('DO11').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"Done")
    })

    it('"Done" status has 11 tasks',()=>{
        cy.get('.itbkk-status:contains("Done")').should('have.length',11) ; ;
    })

})