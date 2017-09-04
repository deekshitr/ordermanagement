module.exports = function(app,db) {
	
	
var item= db.model('Item');


	
	app.get('/api/itemlist', function(req, res) {

		
		console.log("received getAllItem request");
		
		item.find({},function(err, doc) {
			

			if (!err) {
				res.json(doc.slice(0,500));
			} else {
				res.json(err);
			}
			});

	});
	app.get('/api/itemlist/:id', function(req, res) {

		var itemid=req.params.id;
		console.log("received edit item request for" + itemid);
		
		item.findById(itemid,function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});
	app.post('/api/itemsearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'item_code': { $regex: regex }},{'item_name': { $regex: regex }},{'pack':{ $regex: regex }}];
		
		
		item.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

		app.post('/api/itemcsvlist', function(req, res) {
		console.log("received post");
		var itemobj=new item(req.body);
		
		itemobj.save(function(err,doc){

					if (!err) {
				res.json(doc);
				
			} else {
				res.json(err);
				
			
			}
			
		});
	
	});


	app.get('/api/itemsearch/:search', function(req, res) {
		console.log('testing item',req.params.search);
		var search=req.params.search;
		var regex = new RegExp(search, 'i');
		var query = [{ 'item_code': { $regex: regex }},{'item_name': { $regex: regex }},{'pack':{ $regex: regex }}];
		
		console.log("received Item Search request for" + search);
		item.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				var returnObj={'result':doc};
				res.json(returnObj);
			} else {
				
					res.json(err);
			}

			});


	});

	app.get('/api/itemskusearch/:sku', function(req, res) {
		
		var sku=req.params.sku;
		
		console.log("received Item Search request for",sku);
		item.findOne({'item_code':sku},function(err, doc) {
			
			if (!err) {
				
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

	app.post('/api/itemlist', function(req, res) {
		console.log("received post");
		var itemobj= new item(req.body);
		itemobj.save(function(err,doc){

			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

	app.delete('/api/itemlist/:id', function(req, res) {
		console.log("received delete");
		var itemid=req.params.id;
	
		
		item.findOneAndRemove({"_id": itemid},function(err,doc){
			if(!err)
				res.json(doc);
			else
				res.json(err);
		});
	});


	app.put('/api/itemlist/:id', function(req, res) {
		console.log("updated post");
		
		var updateditem=req.body;
		
		var itemid=updateditem._id;
		 
		item.findOneAndUpdate({_id:itemid},updateditem,function(err,doc){
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

};