
describe('/login Endpoint', function(){
   
  //GET /login : jika sudah login: Mengembalikan redirect 3XX ke /
  it('sudah login redirect 3XX ke /' ,function(){

      cy.bypassLogin()
      
      cy.intercept('/login').as('sudahLogin')
      cy.visit('/login')
      cy.wait('@sudahLogin').its('response.statusCode').should('eq', 302)
      cy.url().should('eq',Cypress.config().homeUrl)
     
  })
  //GET /login :  belum login: Menampilkan form login dengan username & password
  it('belum login: Menampilkan form login dengan username & password' ,function(){
     
      cy.visit('/login')
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[type="submit"]').should('be.visible')
  
  })
  
  //POST /login : jika sudah login: Mengembalikan redirect 3XX ke /
  it('jika sudah login:  redirect 3XX ke /' ,function(){

      cy.bypassLogin()

      cy.intercept('/login').as('sudahLogin')
      cy.visit({
          url: '/login',
          method: 'POST',
      })
      cy.wait('@sudahLogin').its('response.statusCode').should('eq', 302)
      cy.url().should('eq',Cypress.config().homeUrl)
  })

  /*
  POST /login : 
  belum login: Mengembalikan redirect 3XX ke / jika kombinasi username & password 
  merupakan data pengguna yang valid dan cookie session_id diset
  */
  it('belum login POST ke /login dengan valid username & password redirect 3XX ke /' ,function(){
      
      cy.intercept('/login').as('interceptLogin')
      cy.visit({
          url: '/login',
          method: 'POST',
          //valid username dan password
          body: {
            username: 'root',
            password: 'root123',
          },
      })
      cy.wait('@interceptLogin').its('response.statusCode').should('eq', 302)
      cy.url().should('eq',Cypress.config().homeUrl)
      //will fail because no cookie named session_id, diaplikasi nama cookie loginnya 'username'
      //cy.getCookie('session_id').should('exist')
      cy.getCookie('username').should('exist')
  
  })

  /*
  POST /login
  Mengembalikan respon 4XX jika kombinasi username & password 
  BUKAN merupakan data pengguna yang valid
  */
  it('belum login POST /login dengan username dan password invalid respon 4XX ',function(){
      
      //ISSUES 211 if using cy.visit() for non HTML response
      //response 4XX bertipe text/plain, 
      //cypress secara otomatis ngeset header Accept: text/html untuk command cy.visit()
      //-> https://docs.cypress.io/api/commands/visit#History
      //https://github.com/cypress-io/cypress/issues/211
      //jadi saya  menggunakan cy.request()
      cy.request({
        url: '/login',
        method: 'POST',
        failOnStatusCode: false,
        //wrong data
        body: {
          username: 'admin',
          password: 'wrongpassword',
        },
        form: true,
      }).then((resp) => {
        // should have status code 302
        expect(resp.status).to.eq(401)
      })

   })

})  