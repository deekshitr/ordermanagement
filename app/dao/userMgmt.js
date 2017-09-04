		module.exports = function(app,db) {
			
		var user= db.model('User');


			app.get('/api/userlist', function(req, res) {

				
				console.log("received getAllUser request");
				
				user.find({}).populate('role').exec(function(err, doc) {
					
				  user.populate(doc, {
				    path: 'role.access',
				    model: 'View'
				     },

				     function(err, docs) {
				    if (!err) {
						res.json(docs);
					} else {
						res.json(err);
					}
				   
				  });
				});
				});

			app.get('/api/userlist/:id', function(req, res) {

		var userid=req.params.id;
		console.log("received editUser request for" + userid);
		
		user.findById(userid).populate('role').exec(function(err, doc) {
					
				  user.populate(doc, {
				    path: 'role.access',
				    model: 'View'
				     },

				     function(err, docs) {
				    if (!err) {
						res.json(docs);
					} else {
						res.json(err);
					}
				   
				  });
			});

		});
			
					

			app.get('/api/loggedinuser', function(req, res) {

				var user= req.user;
				console.log("logged in user info");

				if(user)
				res.json(user);
				else
					res.json({'errormsg':'No User Found'});


			});


		app.post('/api/usersearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'lastname': { $regex: regex }},{'firstname': { $regex: regex }},{'username':{ $regex: regex }},{'role':{ $regex: regex }},{'issuper':{ $regex: regex }}];
		
		console.log("received User Search request for" + search.searchText);
		user.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

			app.post('/api/userlist', function(req, res) {
				

				var userobj= new user(req.body);
				
				userobj.save(function(err,doc){

					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

			app.delete('/api/userlist/:id', function(req, res) {
				console.log("received delete");
				var userid=req.params.id;
			
				
				user.findOneAndRemove({"_id": userid},function(err,doc){
					if(!err)
						res.json(doc);
					else
						res.json(err);
				});
			});


			app.put('/api/userlist/:id', function(req, res) {
				console.log("updated post");
				
				var updateduser=req.body;
				
				var userid=updateduser._id;
				 
				user.findOneAndUpdate({_id:userid},updateduser,function(err,doc){
					
					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

		};