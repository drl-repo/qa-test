describe('/data Endpoint', ()=>{
	/*
	GET /data GET: 
	jika sudah login: 
	Menampilkan dengan 2 tabel yang berisi daftar 10 pemasukan dan pengeluaran terakhir, 
	dapat difilter berdasarkan timestamp start dan end terpisah untuk pemasukan dan pengeluaran, 
	mengembalikan respon 4XX jika salah satu start > end
	*/
	it('sudah login: tampil 2 heading, 2 table, 2 form', function(){
      
       cy.bypassLogin()
      
       cy.visit('/data')

       //2 heading pemasukan pengeluaran
       cy.get('h1').should('have.length',2)
       cy.get('h1').eq(0).should('have.text','Pemasukan')
       cy.get('h1').eq(1).should('have.text','Pengeluaran')


       //2 tabel
        cy.get('table').should('have.length',2)
	    //table Pemasukan
	    cy.get('table').eq(0).then((table1)=>{
	        //berisi 10 daftar, except first tr, because it is a table heading
	        cy.wrap(table1).find('tr:not(:first-child)').should('have.length',10)
	        
	    })

	    //table pengeluaran
	    cy.get('table').eq(1).then((table2)=>{
	      	//berisi 10 daftar, except first tr, because it is a table heading
	        cy.wrap(table2).find('tr:not(:first-child)').should('have.length',10)
	    })


	   //2 form start dan end
       cy.get('input[name="start"]').should('exist')
       cy.get('input[name="end"]').should('exist')

   })

	it('mengembalikan respon 4XX jika salah satu start > end', function(){
      	
      	cy.bypassLogin()
      	 //ISSUES 211 if using cy.visit() for no HTML response
      	cy.request({
	        url: '/filter',
	        method: 'POST',
	        failOnStatusCode: false, 
	        body: {
	          //start lebih dari end
	          start: '2018-07-11',
	          end: '2018-07-10',
	        },
	        form: true,
	      }).then((resp) => {
	        // should have status code 4xx
	        expect(resp.status).to.eq(405)
	    })
    })

    //GET /data belum login: Mengembalikan redirect 3XX ke /login
    it('belum login: Mengembalikan redirect 3XX ke /login', function(){
    
      	cy.intercept('/data').as('loginIntercept')
      	cy.visit('/data')
    
      	cy.wait('@loginIntercept').its('response.statusCode').should('eq', 302)
      	cy.url().should('include','/login')

   })


    /*
    POST /data
    jika sudah login: 
    Memasukkan data pemasukan / pengeluaran baru, yang berisi timestamp, deskripsi dan jumlah
	*/
	it('sudah login dan memasukkan data pemasukan / pengeluaran ', function(){
     
       //ISSUES 211 if using cy.visit() to for non html response
      cy.visit('/')
      cy.request({
        url: '/data',
        method: 'POST',
        failOnStatusCode: false,
	    body: {
	       TimeStamp: '2018-07-12',
	       Deskripsi: 'pemasukan-12',
	       Jumlah: 50
	    },
        form: true,
      }).then((resp) => {
        expect(resp.status).to.eq(200)
    	
      })
      

   })

	it('POST /data belum login: Mengembalikan redirect 3XX ke /login', function(){
      //ISSUES 211 if using cy.visit() for non HTML response
      
      cy.request({
        url: '/data',
        method: 'POST',
        headers : {
          accept:'text/plain'
        }
        
      }).then((resp) => {
        // should have status code 302
        
          cy.url().should('include','/login')
      })

  })

})