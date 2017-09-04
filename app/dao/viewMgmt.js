		module.exports = function(app,db) {
			
		var view= db.model('View');
			
			app.get('/api/viewlist', function(req, res) {

				
				console.log("received getAllView request");
				
				view.find({},function(err, doc) {
					
					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					});
				});
	app.post('/api/viewsearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'id': { $regex: regex }},{'name': { $regex: regex }},{'path':{ $regex: regex }}];
		
		console.log("received View Search request for" + search.searchText);
		view.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

			app.post('/api/viewlist', function(req, res) {
				

				var viewobj= new view(req.body);
				
				viewobj.save(function(err,doc){

					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

			app.delete('/api/viewlist/:id', function(req, res) {
				console.log("received delete");
				var viewid=req.params.id;
			
				
				view.findOneAndRemove({"_id": viewid},function(err,doc){
					if(!err)
						res.json(doc);
					else
						res.json(err);
				});
			});


			app.put('/api/viewlist/:id', function(req, res) {
				console.log("updated post");
				
				var updatedview=req.body;
				
				var viewid=updatedview._id;
				 
				view.findOneAndUpdate({_id:viewid},updatedview,function(err,doc){
					
					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

		};