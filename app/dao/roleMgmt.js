module.exports = function(app,db) {
	
	
var role= db.model('Role');
	
	app.get('/api/rolelist', function(req, res) {

		
		console.log("received getAllRoles request");
		
		role.find({}).populate('access').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});
	app.get('/api/rolelist/:id', function(req, res) {

		var roleid=req.params.id;
		console.log("received editRole request for" + roleid);
		
		role.findById(roleid).populate('access').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});
	app.post('/api/rolesearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'roleid': { $regex: regex }},{'rolename': { $regex: regex }}];
		
		console.log("received Role Search request for" + search.searchText);
		role.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

	app.post('/api/rolelist', function(req, res) {
		console.log("received post");
		var roleobj= new role(req.body);
		roleobj.save(function(err,doc){

			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

	app.delete('/api/rolelist/:id', function(req, res) {
		console.log("received delete");
		var roleid=req.params.id;
		
		role.findOneAndRemove({"_id": roleid},function(err,doc){
			if(!err)
				res.json(doc);
			
			else
				res.json(err);
			
		});
	});


	app.put('/api/rolelist/:id', function(req, res) {
		console.log("updated post");
		var updatedrole=req.body;
		
		var roleid=updatedrole._id;
		 
		role.findOneAndUpdate({_id:roleid},updatedrole,function(err,doc){
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});
	app.put('/api/addviewlist/:id', function(req, res) {
				console.log("received addview request");
				var viewid= req.params.id;
				var newview=req.body;

				role.update({_id:viewid},{$push:{access:newview._id}},function(err,doc){
					
					if (!err) {
						console.log("pushed");
						res.json(doc);
					} else {
						console.log(err);
						res.json(err);
					}
					
				});
			});

		app.put('/api/removeviewlist/:id', function(req, res) {
			 	var viewid= req.params.id;

				var oldview=req.body;

				console.log("oldview",oldview);
				
				 console.log("viewid",viewid);
				role.update({_id:viewid},{$pull:{access:oldview._id}},function(err,doc){
					
					if (!err) {
						console.log("pulled");
						res.json(doc);
					} else {
						console.log(err);
						res.json(err);
					}
					
				});
			});

};