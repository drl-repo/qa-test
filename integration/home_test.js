
describe('Homepage Endpoint', () => {
  //GET / : Menampilkan halaman utama yang berisi pesan selamat datang
  it('Kunjungi Homepage' ,function(){

      cy.visit('/')
      cy.get('h1').contains('Welcome!')
  
  })
})