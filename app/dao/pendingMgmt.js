module.exports = function(app,db) {
	

var pending= db.model('Pending');
var item= db.model('Item');
	
	app.get('/api/pendinglist', function(req, res) {

		
		console.log("received getAllPending request");
		
		
		 pending.find({}).sort('order_id').populate('item_details').populate('agreed_supplier').exec(function(err, doc) {
   		 
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});

	app.get('/api/pendinglist/:fcid', function(req, res) {
	var fcid=req.params.fcid;
	pending.find({fc:fcid}).sort('order_id').populate('item_details').populate('agreed_supplier').exec(function(err, doc) {
   		 
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});




			app.get('/api/pendingitemlist', function(req, res) {
				
				pending.aggregate([  
				   
		        { $group: {
		            _id: "$sku",
		            total_ordered_qty: { $sum: "$ordered_qty"  },
		            total_available_qty: { $sum: "$fullfilled_qty"  }
		        }}
		    ], function (err, result) {
		        if (err) {
		            console.log(err);
		            res.json(err);
		        }

		        res.json(result);
			});

		});

			app.get('/api/pendingitemsearch/:sku', function(req, res) {
				var sku=req.params.sku;
				
				pending.aggregate([ 

				{ 
			$match : {sku : sku}
		    }, 
				   
		        { $group: {
		            _id: "$sku",
		            total_ordered_qty: { $sum: "$ordered_qty"  },
		            total_available_qty: { $sum: "$fullfilled_qty"  }
		        }}
		    ], function (err, result) {
		   
		        if (err) {
		            console.log(err);
		            res.json(err);
		        }

		        res.json(result);
			});


		});

			app.get('/api/pendingitemlist/:fcid', function(req, res) {
				var fcid=req.params.fcid;
				
				pending.aggregate([ 

				{ 
			$match : {fc : fcid}
		    }, 
				   
		        { $group: {
		            _id: "$sku",
		            total_ordered_qty: { $sum: "$ordered_qty"  },
		            total_available_qty: { $sum: "$fullfilled_qty"  }
		        }}
		    ], function (err, result) {
		   
		        if (err) {
		            console.log(err);
		            res.json(err);
		        }

		        res.json(result);
			});


		});
	

	app.get('/api/itemmatch', function(req, res) {

		var sku= pending.sku;
		 
		
		console.log("received getAllPending request");
		
		
		 pending.find({}).sort('order_id').populate('item_details').exec(function(err, doc) {
   		 
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});


	app.get('/api/pendinglist/:id', function(req, res) {

		var pendingid=req.params.id;
		console.log("received editPending request for" + pendingid);
		
		pending.findById(pendingid).populate('item_details').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});

	app.get('/api/pendingdetails/:orderid', function(req, res) {

		var orderid=req.params.orderid;
		console.log("received editPending request for" + orderid);
		pending.find({order_id:orderid}).sort('order_id').populate('item_details').populate('agreed_supplier').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				console.log(err);
				res.json(err);
			}
			});

	});

	app.get('/api/pendingsuppdetails/:id', function(req, res) {

		var id=req.params.id;
		console.log("received editPending request for" + id);
		pending.find({_id:id}).populate('item_details').populate('agreed_supplier.supplier_id').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				console.log(err);
				res.json(err);
			}
			});

	});

	

	app.post('/api/pendingsearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'order_id': { $regex: regex }},{'qtyordered': { $regex: regex }},{'qtyavailable':{ $regex: regex }},{'sku':{ $regex: regex }},{'fc':{ $regex: regex }}];
		
		console.log("received Pending Search request for" + search.searchText);
		pending.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});



	app.post('/api/pendinglist', function(req, res) {
		console.log("received post");
		var pendingobj= new pending(req.body);
		pendingobj.save(function(err,doc){
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

	app.post('/api/ordersummarysearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');
		var query = [{ 'order_id': { $regex: regex }}];
		
		console.log("received Pending Search request for" + search.searchText);
		pending.find().or(query).exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});

	app.post('/api/itemsummarysearch/', function(req, res) {
		
		var search=req.body;
		var regex = new RegExp(search.searchText, 'i');

		var query = [{ 'sku': { $regex: regex }}];
		
		console.log("received Pending Search request for" + search.searchText);
		pending.find().or(query).populate('item_details').exec(function(err, doc) {
			

			if (!err) {
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});


	app.delete('/api/pendinglist/:id', function(req, res) {
		console.log("received delete");
		var pendingid=req.params.id;
	
		
		pending.findOneAndRemove({"_id": pendingid},function(err,doc){
			if(!err)
				res.json(doc);
			else
				res.json(err);
		});
	});


	app.put('/api/pendinglistaddsupp/:id', function(req, res) {
		console.log("updated pendinglistaddsupp");
		var pendingid=req.params.id;
		var commsupplier=req.body;
		pending.update({'_id':pendingid},{$inc:{'fullfilled_qty':commsupplier.agreed_qty},$push:{'agreed_supplier':commsupplier}},function(err,doc){
		
			if (!err) {
				console.log(doc);
				res.json(doc);
			} else {
				console.log(err);
				res.json(err);
			}
			
		});
	});


	app.get('/api/pendingitemsku/:sku', function(req, res) {

		var sku=req.params.sku;
		console.log("received get request for" + sku);
		pending.find({sku:sku}).populate('item_details').populate('agreed_supplier.supplier_id').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				console.log(err);
				res.json(err);
			}
			});

	});

	app.get('/api/filterfc', function(req, res) {

		
		console.log("received pendinglist by filter request");
		
		
		 pending.find({}).sort('order_id'),function(err, doc) {
   		 
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
		}
			
	});

	

};