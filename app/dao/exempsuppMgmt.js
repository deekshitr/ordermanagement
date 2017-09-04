module.exports = function(app,db) {
			
		var exemptedSupp= db.model('ExemptedSupp');
		
		app.post('/api/exemptedsupp', function(req, res) {
				

				var exemppobj= new exemptedSupp(req.body);
				
				exemppobj.save(function(err,doc){

					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});


		app.get('/api/exemptedsupp/:sku', function(req, res) {
		
		var skuid=req.params.sku;
		var query={'sku':skuid};
		console.log(query);
		
		exemptedSupp.find(query,function(err, doc) {
			console.log(doc);
			if (!err) {
				res.json(doc);
			} else {
				console.log(err);
				res.json(err);
			}
			});

	});


		
}