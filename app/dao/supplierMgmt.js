module.exports = function(app,db) {
	
	
var supplier= db.model('Supplier');
	
	app.get('/api/supplierlist', function(req, res) {

		
		console.log("received getAllSupplier request");
		
		supplier.find({}).sort({'weightage':-1}).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				console.log(err);
				res.json(err);
			}
			});

	});
	app.get('/api/supplierlist/:id', function(req, res) {

		var supplierid=req.params.id;
		console.log("received editSupplier request for" + supplierid);
		
		supplier.findById(supplierid,function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});
	app.post('/api/suppliersearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'cust_id': { $regex: regex }},{'cust_name': { $regex: regex }},{'add_1':{ $regex: regex }},{'add_2':{ $regex: regex }},{'city':{ $regex: regex }},{'phone_1':{ $regex: regex }},{'phone_2':{ $regex: regex }},{'weightage':{ $regex: regex }}];
		
		console.log("received supplier Search request for" + search.searchText);
		supplier.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

	app.post('/api/supplierinfosearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{'cust_name': { $regex: regex }}];
		
		console.log("received supplier Search request for" + search.searchText);
		supplier.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

	app.get('/api/suppliersearch/:search', function(req, res) {
		
		var search=req.params.search;
		var regex = new RegExp(search, 'i');
		var query = [{ 'cust_id': { $regex: regex }},{'cust_name': { $regex: regex }},{'city':{ $regex: regex }},{'add_1':{ $regex: regex }},
		{'add_2':{ $regex: regex }},{'phone_1':{ $regex: regex }},{'phone_2':{ $regex: regex }},{'mobile':{ $regex: regex }}];
		
		console.log("received  Supplier Search request for" + search);
		supplier.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				var returnObj={'result':doc};
				res.json(returnObj);
			} else {
				
					res.json(err);
			}

			});


	});


	app.post('/api/supplierlist', function(req, res) {
		console.log("received post");
		var supplierobj= new supplier(req.body);
		supplierobj.save(function(err,doc){

			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

	app.post('/api/suppliercsvlist', function(req, res) {
		console.log("received post");
		var supplierobj=new supplier(req.body);
		
		supplierobj.save(function(err,doc){

					if (!err) {
				res.json(doc);
				
			} else {
				res.json(err);
				
			
			}
			
		});
	
	});

		app.delete('/api/supplierlist/:id', function(req, res) {
		console.log("received delete");
		var supplierid=req.params.id;
		
		supplier.findOneAndRemove({"_id": supplierid},function(err,doc){
			if(!err)
				res.json(doc);
			else
				res.json(err);
		});
	});


	app.put('/api/supplierlist/:id', function(req, res) {
		console.log("updated post");
		
		var updatedsupplier=req.body;
		
		var supplierid=updatedsupplier._id;
		 
		supplier.findOneAndUpdate({_id:supplierid},updatedsupplier,function(err,doc){
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

};