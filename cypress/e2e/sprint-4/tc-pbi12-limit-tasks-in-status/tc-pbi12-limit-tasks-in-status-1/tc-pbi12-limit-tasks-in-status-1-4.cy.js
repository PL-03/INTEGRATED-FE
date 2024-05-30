describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-1\n 
          Test Scenario : normal - limit disabled\n
           -add/edit task > limit \n
           -step 3 to 6`, () => {
  
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

    it('should have add button and click to open modal',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
    })

    it('************************* STEP 3 *******************************',()=>{        
    })
    
    it('Add the task "TD10" with "To Do"',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
        cy.wait(100)
    
        cy.get('.itbkk-title').type("TD10")
        cy.get('.itbkk-description').clear()
        cy.get('.itbkk-assignees').clear()
        cy.get('.itbkk-status').select('To Do')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    })
    
    it('Should have task title "TD10" with To Do',()=>{
        cy.get('.itbkk-title').contains('TD10').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"To Do")
    })

    it('"To Do" status has 10 tasks',()=>{
        cy.get('.itbkk-status:contains("To Do")').should('have.length',10) ;
    })

    it('************************* STEP 4 *******************************',()=>{        
    })

    it('Add the task "IP11" with "In Progress"',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
        cy.wait(100)
    
        cy.get('.itbkk-title').type("IP11")
        cy.get('.itbkk-description').clear()
        cy.get('.itbkk-assignees').clear()
        cy.get('.itbkk-status').select('In Progress')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    })
    
    it('Should have task title "IP11" with In Progress',()=>{
        cy.get('.itbkk-title').contains('IP11').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"In Progress")
    })

    it('"In Progress" status has 11 tasks',()=>{
        cy.get('.itbkk-status:contains("In Progress")').should('have.length',11) ; ;
    })

    it('************************* STEP 5 *******************************',()=>{        
    })

    it('Edit the task "TD10" and change status to "In Progress".',()=>{
        cy.get('.itbkk-title').contains('TD10').parents('.itbkk-item').as('item')
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100) ;

        cy.get('.itbkk-status').select('In Progress')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click() 
    })

    it('"In Progress" status has 12 tasks',()=>{
        cy.get('.itbkk-status:contains("In Progress")').should('have.length',12) ;
    })

    it('************************* STEP 6 *******************************',()=>{        
    })

    it('Edit the task "IP11" and change status to "To Do".',()=>{
        cy.get('.itbkk-title').contains('IP11').parents('.itbkk-item').as('item')
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100) ;

        cy.get('.itbkk-status').select('To Do')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click() 
    })

    it('"In Progress" status has 11 tasks',()=>{
        cy.get('.itbkk-status:contains("In Progress")').should('have.length',11) ;
    })

})