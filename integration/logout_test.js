describe('/logout Endpoint', ()=>{
   
   //POST /logout : Menghapus cookie session_id dan mengembalikan redirect 3XX ke /
   it('POST /logout hapus cookie session_id dan  redirect 3XX ke /' ,function(){

      cy.intercept('logout').as('logoutIntercept')
      cy.visit({
          url: '/logout',
          method: 'POST',
          failOnStatusCode: false,
      })
      
      cy.wait('@logoutIntercept').its('response.statusCode').should('eq', 302)
      cy.url().should('eq',Cypress.config().homeUrl)
      cy.getCookie('session_id').should('not.exist')
      //memang tidak ada cookie bernama session_id meskipun statusnya sedang login
      //karna cookie yg tersimpan ketika login bernama 'username'
      //tapi di dokument test seperti itu, so ?
  
  })
})