		module.exports = function(app,db) {
			
		var fc= db.model('Fc');
		
				app.get('/api/fclist', function(req, res) {
				console.log("received getAllFc request");
				fc.find({}).sort('fc_id').populate('suppliers').exec(function(err, doc) {
				
				    if (!err) {
				    	
						res.json(doc);
					} else {
						res.json(err);
					}
				   
				  });
				});

		app.get('/api/fclist/:id', function(req, res) {
		var fcid=req.params.id;
		console.log("received editFc request for" + fcid);
		
		fc.findById(fcid).populate('suppliers').exec(function(err, doc) {
					
				    if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
				   
				  });
			});

		app.get('/api/fcsupplierlist/:code', function(req, res) {
		var fccode=req.params.code;
		console.log("received getFc request for" + fccode);
		
		fc.findOne({'fc_id':fccode}).populate({path: 'suppliers', options: { sort: { 'weightage': -1 } } }).exec(function(err, doc) {
					
				    if (!err) {
						res.json(doc);
					} else {

						console.log(err);
						res.json(err);
					}
				   
				  });
			});

		app.post('/api/fcsearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'fc_id': { $regex: regex }},{'fc_location': { $regex: regex }}];
		
		console.log("received Fc Search request for" + search.searchText);
		fc.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});


	app.get('/api/primaryfcsearch/:search', function(req, res) {
		console.log('testing primaryfcsearch',req.params.search);
		var search=req.params.search;
		var regex = new RegExp(search, 'i');
		var query = [{ 'fc_id': { $regex: regex }},{'fc_location': { $regex: regex }}];
		
		console.log("received Primary Fc Search request for" + search);
		fc.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				var returnObj={'result':doc};
				res.json(returnObj);
			} else {
				
					res.json(err);
			}

			});
		});

			app.post('/api/fclist', function(req, res) {
				console.log("received post",req.body);

				var fcobj= new fc(req.body);
				
				fcobj.save(function(err,doc){

					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

			app.delete('/api/fclist/:id', function(req, res) {
				console.log("received delete");
				var fcid=req.params.id;
				
				fc.findOneAndRemove({"_id": fcid},function(err,doc){
					if(!err)
						res.json(doc);
					else
						res.json(err);
				});
			});


			app.put('/api/fclist/:id', function(req, res) {
				console.log("updated post");
				
				var updatedfc=req.body;
				
				var fcid=updatedfc._id;
				 
				fc.findOneAndUpdate({_id:fcid},updatedfc,function(err,doc){
					
					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

			app.put('/api/addsuppfc/:id', function(req, res) {
				console.log("updated post");
				var fcid= req.params.id;

				var newfc=req.body;

				
				
				 
				
				fc.update({_id:fcid},{$push:{suppliers:newfc._id}},function(err,doc){
					
					if (!err) {
						res.json(doc);
					} else {
						console.log(err);
						res.json(err);
					}
					
				});
			});

			 app.put('/api/removesuppfc/:id', function(req, res) {
			 	var fcid= req.params.id;

				var oldsupp=req.body;
				fc.update({_id:fcid},{$pull:{suppliers:oldsupp._id}},function(err,doc){
					console.log(doc);
					if (!err) {
						res.json(doc);
					} else {
						console.log(err);
						res.json(err);
					}
					
				});
			});
		};