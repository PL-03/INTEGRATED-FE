describe(`TC-PBI12-LIMIT-TASKS-IN-STATUS-2-3\n 
          Test Scenario : normal - limit enabled\n
           -add/edit task in other statuses > limit\n`, () => {
  
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

    it('Task table has 46 task entries.',()=>{
        cy.get('.itbkk-item').should('have.length',46) ;
    })

    it('************************* STEP 3 *******************************',()=>{        
    })

    it('Edit task "IP01" and change status to "Done" and click the save button.',()=>{
        cy.get('.itbkk-title').contains("IP01")
        cy.get('.itbkk-title').contains("IP01").parents(".itbkk-item").as("item")
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100)

        cy.get('.itbkk-status').select('Done')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    
        cy.wait(100)
        cy.url().should('contain','/task')
    
      })
    
    it('Should have task title "IP01" with Done',()=>{
        cy.get('.itbkk-title').contains('IP01').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"Done")
    })

    it('Edit task "IP02" and change status to "Done" and click the save button.',()=>{
        cy.get('.itbkk-title').contains("IP02")
        cy.get('.itbkk-title').contains("IP02").parents(".itbkk-item").as("item")
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100)

        cy.get('.itbkk-status').select('Done')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    
        cy.wait(100)
        cy.url().should('contain','/task')
    
      })
    
    it('Should have task title "IP02" with Done',()=>{
        cy.get('.itbkk-title').contains('IP02').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"Done")
    })

    it('"Done" status has 13 tasks',()=>{
        cy.get('.itbkk-status:contains("Done")').should('have.length',13) ;
    })

    it('"In Progress" status has 9 tasks',()=>{
        cy.get('.itbkk-status:contains("In Progress")').should('have.length',9) ;
    })

    it('************************* STEP 4 *******************************',()=>{        
    })

    it('Edit task "TD09" and change status to "No Status" and click the save button.',()=>{
        cy.get('.itbkk-title').contains("TD09")
        cy.get('.itbkk-title').contains("TD09").parents(".itbkk-item").as("item")
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100)

        cy.get('.itbkk-status').select('No Status')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    
        cy.wait(100)
        cy.url().should('contain','/task')
    
      })
    
    it('Should have task title "TD09" with No Status',()=>{
        cy.get('.itbkk-title').contains('TD09').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"No Status")
    })

    it('"No Status" status has 12 tasks',()=>{
        cy.get('.itbkk-status:contains("No Status")').should('have.length',12) ;
    })

    it('"To Do" status has 10 tasks',()=>{
        cy.get('.itbkk-status:contains("To Do")').should('have.length',10) ;
    })

    it('************************* STEP 5 *******************************',()=>{        
    })

    it('Edit task "TD01" and change status to "In Progress" and click the save button.',()=>{
        cy.get('.itbkk-title').contains("TD01")
        cy.get('.itbkk-title').contains("TD01").parents(".itbkk-item").as("item")
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100)

        cy.get('.itbkk-status').select('In Progress')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    
        cy.wait(100)
        cy.url().should('contain','/task')
    
      })
    
    it('Should have task title "TD01" with In Progress',()=>{
        cy.get('.itbkk-title').contains('TD01').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"In Progress")
    })

    it('"In Progress" status has 10 tasks',()=>{
        cy.get('.itbkk-status:contains("In Progress")').should('have.length',10) ;
    })

    it('"To Do" status has 9 tasks',()=>{
        cy.get('.itbkk-status:contains("To Do")').should('have.length',9) ;
    })

    it('************************* STEP 6 *******************************',()=>{        
    })

    it('Edit task "TD02" and change status to "In Progress" and click the save button.',()=>{
        cy.get('.itbkk-title').contains("TD02")
        cy.get('.itbkk-title').contains("TD02").parents(".itbkk-item").as("item")
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100)

        cy.get('.itbkk-status').select('In Progress')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    
        cy.wait(100)
        cy.url().should('contain','/task')
    
      })
    
    it('Cannot edit "TD02", the "TD02" is still in "To Do".',()=>{
        cy.get('.itbkk-title').contains('TD02').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"To Do")
    })

    it('"In Progress" status has 10 tasks',()=>{
        cy.get('.itbkk-status:contains("In Progress")').should('have.length',10) ;
    })

    it('"To Do" status has 9 tasks',()=>{
        cy.get('.itbkk-status:contains("To Do")').should('have.length',9) ;
    })

    it('************************* STEP 7 *******************************',()=>{        
    })

    it('Add the task "TD11" with "To Do"',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
        cy.wait(100)
    
        cy.get('.itbkk-title').type("TD11")
        cy.get('.itbkk-description').clear()
        cy.get('.itbkk-assignees').clear()
        cy.get('.itbkk-status').select('To Do')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    })
    
    it('Should have task title "TD11" with To Do',()=>{
        cy.get('.itbkk-title').contains('TD11').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"To Do")
    })

    it('"To Do" status has 10 tasks',()=>{
        cy.get('.itbkk-status:contains("To Do")').should('have.length',10) ;
    })

    it('************************* STEP 8 *******************************',()=>{        
    })

    it('Add the task "TD12" with "To Do"',()=>{
        cy.get('.itbkk-button-add').should('exist').click() ;
        cy.wait(100)
    
        cy.get('.itbkk-title').type("TD12")
        cy.get('.itbkk-description').clear()
        cy.get('.itbkk-assignees').clear()
        cy.get('.itbkk-status').select('To Do')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    })
    
    it('Cannot add "TD12, The "TD12" is not in the task table',()=>{
        cy.contains('.itbkk-title','TD12').should('not.exist')
    })

    it('"To Do" status has 10 tasks',()=>{
        cy.get('.itbkk-status:contains("To Do")').should('have.length',10) ;
    })

    it('************************* STEP 9 *******************************',()=>{        
    })

    it('Edit task "IP03" and change status to "Done" and click the save button.',()=>{
        cy.get('.itbkk-title').contains("IP03")
        cy.get('.itbkk-title').contains("IP03").parents(".itbkk-item").as("item")
        cy.get('@item').find('.itbkk-button-action').click().as('action')
        cy.get('@action').find('.itbkk-button-edit').click()
        cy.wait(100)

        cy.get('.itbkk-status').select('Done')
        cy.get('.itbkk-button-confirm').contains('save',{matchCase: false}).as('save') ;
        cy.get('@save').click()
    
        cy.wait(100)
        cy.url().should('contain','/task')
      })

      it('Should have task title "IP03" with Done',()=>{
        cy.get('.itbkk-title').contains('IP03').parents('.itbkk-item').as('item')
        cy.get('@item').contains('.itbkk-assignees','Unassigned')
        cy.get('@item').contains('.itbkk-status',"Done")
    })

    it('"Done" status has 14 tasks',()=>{
        cy.get('.itbkk-status:contains("Done")').should('have.length',14) ;
    })

    it('"In Progress" status has 9 tasks',()=>{
        cy.get('.itbkk-status:contains("In Progress")').should('have.length',9) ;
    })

})