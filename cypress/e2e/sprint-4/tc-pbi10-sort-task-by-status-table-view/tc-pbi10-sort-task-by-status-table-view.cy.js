describe(`TC-PBI10-SORT-TASK-BY-STATUS-TABLE-VIEW-1\n 
          Test Scenario : normal - sort alphabetical, reverse and return to default`, () => {
  
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

  it('Task table has 6 task entries.',()=>{
    cy.get('.itbkk-item').should('have.length',6) ;
  })

  it('Task items should be [NS01,TD01,IP01,TD02,DO01,IP02]',()=>{
    cy.get('.itbkk-item').eq(0).as('item')
    cy.get('@item').contains('.itbkk-title','NS01') ;
    cy.get('@item').contains('.itbkk-status','No Status') ;

    cy.get('.itbkk-item').eq(1).as('item')
    cy.get('@item').contains('.itbkk-title','TD01') ;
    cy.get('@item').contains('.itbkk-status','To Do') ;

    cy.get('.itbkk-item').eq(2).as('item')
    cy.get('@item').contains('.itbkk-title','IP01') ;
    cy.get('@item').contains('.itbkk-status','In Progress') ;

    cy.get('.itbkk-item').eq(3).as('item')
    cy.get('@item').contains('.itbkk-title','TD02') ;
    cy.get('@item').contains('.itbkk-status','To Do') ;

    cy.get('.itbkk-item').eq(4).as('item')
    cy.get('@item').contains('.itbkk-title','DO01') ;
    cy.get('@item').contains('.itbkk-status','Done') ;

    cy.get('.itbkk-item').eq(5).as('item')
    cy.get('@item').contains('.itbkk-title','IP02') ;
    cy.get('@item').contains('.itbkk-status','In Progress') ;
  })

  it('The task list page should have a status sort button ', () => {
    cy.get('.itbkk-status-sort').should('exist') ;
  })

  it('Click the status sort button and the status of tasks should be [Done, In Progress, In Progress, No Status, To Do, To Do]', () => {
    cy.get('.itbkk-status-sort').should('exist').click() ;
    cy.wait(100) ;

    cy.get('.itbkk-item').eq(0).as('item')
    cy.get('@item').contains('.itbkk-status','Done') ;

    cy.get('.itbkk-item').eq(1).as('item')
    cy.get('@item').contains('.itbkk-status','In Progress') ;

    cy.get('.itbkk-item').eq(2).as('item')
    cy.get('@item').contains('.itbkk-status','In Progress') ;

    cy.get('.itbkk-item').eq(3).as('item')
    cy.get('@item').contains('.itbkk-status','No Status') ;

    cy.get('.itbkk-item').eq(4).as('item')
    cy.get('@item').contains('.itbkk-status','To Do') ;

    cy.get('.itbkk-item').eq(5).as('item')
    cy.get('@item').contains('.itbkk-status','To Do') ;
  })

  it('Click the status sort button again to reverse the order and the status of tasks should be [ To Do, To Do, No Status, In Progress, In Progress, Done]', () => {
    cy.get('.itbkk-status-sort').should('exist').click() ;
    cy.wait(100) ;
    cy.get('.itbkk-status-sort').should('exist').click() ;
    cy.wait(100) ;

    cy.get('.itbkk-item').eq(0).as('item')
    cy.get('@item').contains('.itbkk-status','To Do') ;

    cy.get('.itbkk-item').eq(1).as('item')
    cy.get('@item').contains('.itbkk-status','To Do') ;

    cy.get('.itbkk-item').eq(2).as('item')
    cy.get('@item').contains('.itbkk-status','No Status') ;

    cy.get('.itbkk-item').eq(3).as('item')
    cy.get('@item').contains('.itbkk-status','In Progress') ;

    cy.get('.itbkk-item').eq(4).as('item')
    cy.get('@item').contains('.itbkk-status','In Progress') ;

    cy.get('.itbkk-item').eq(5).as('item')
    cy.get('@item').contains('.itbkk-status','Done') ;
  })

})