module.exports = function(app,db) {
	
var mongoose= require('mongoose');	
var stock= db.model('Stock');
var item= db.model('Item');
var supplier= db.model('Supplier');

	
	app.get('/api/stocklist', function(req, res) {

		
		console.log("received getAllStock request");
		
		stock.find({}).populate('sku').populate('supplier').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});


	app.get('/api/stocklist/:sid/:sku', function(req, res) {
		
		var supplierid=mongoose.Types.ObjectId(req.params.sid);
		var skuid=mongoose.Types.ObjectId(req.params.sku);

		console.log("received getAllStock request");
		var query={'sku':skuid,'supplier':supplierid};
		
		stock.find(query).populate('sku').populate('supplier').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				console.log(err);
				res.json(err);
			}
			});

	});

	app.get('/api/stocklist/:id', function(req, res) {

		var stockid=req.params.id;
		console.log("received editStock request for" + stockid);
		
		stock.findById(stockid).populate('sku').populate('supplier').exec(function(err, doc) {
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			});

	});

	app.post('/api/stocksearch/', function(req, res) {
		
		var search=req.body;
		
		var regex = new RegExp(search.searchText, 'i');
		var query = [{'suppliersku': { $regex: regex }},{'stock':{ $regex: regex }}];
		
		console.log("received Stock Search request for" + search.searchText);
		stock.find().or(query).populate('supplier').populate('sku').exec(function(err, doc) {
			
			if (!err) {
				
				res.json(doc);
			} else {
				
					res.json(err);
			}

			});


	});


	app.post('/api/stocklist', function(req, res) {
		console.log("received post");
		var stockobj= new stock(req.body);
		stockobj.save(function(err,doc){

			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

		app.post('/api/stockcsvlist', function(req, res) {
		console.log("received post");
		var stockobj= req.body;
		
		var sku=stockobj.sku;
		var suppid=stockobj.supplier;
		
		
		
		    item.findOne({'item_code':sku},function(err,objsku){
			   	
			   	
			   stockobj.sku=objsku._id;
			   		
			   	
			  supplier.findOne({'cust_id':suppid},function(err,objsupp){
			   	
			   		
			   		
			   		stockobj.supplier=objsupp._id;
			   		
			   		
			   	var stockTab=new stock(stockobj);
			 stockTab.save(function(err,doc){

			if (!err) {
				res.json(doc);
				
			} else {
				res.json(err);
				console.log("error",err);
			
			}
			
		});
	
	});
});
		
	});

	app.delete('/api/stocklist/:id', function(req, res) {
		console.log("received delete");
		var stockid=req.params.id;
		
		stock.findOneAndRemove({"_id": stockid},function(err,doc){
			if(!err)
				res.json(doc);
			else
				res.json(err);
		});
	});


	app.put('/api/stocklist/:id', function(req, res) {
		console.log("updated post");
		
		var updatedstock=req.body;
		
		var stockid=updatedstock._id;
		 
		stock.findOneAndUpdate({_id:stockid},updatedstock,function(err,doc){
			
			if (!err) {
				res.json(doc);
			} else {
				res.json(err);
			}
			
		});
	});

};