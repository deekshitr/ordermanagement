	module.exports = function(app,db) {

		var mongoose=require('mongoose');
		var fcmapping= db.model('FcMapping');
		var fc=db.model('Fc');

		app.get('/api/fcmappinglist/', function(req, res) {
		
				
				console.log("received getPrimaryFcid request");
				
				fcmapping.find({}).sort('priority').populate('primary_fc').populate('secondary_fc').exec(function(err, doc) {
				
				    if (!err) {
				    	
						res.json(doc);
					} else {
						res.json(err);
					}
				   
				  });
				});

		app.get('/api/fcmappingedit/:mappingid', function(req, res) {
		var mappingid=mongoose.Types.ObjectId(req.params.mappingid);
				
				console.log("received getPrimaryFcid request");
				
				fcmapping.findById(mappingid,function(err, doc) {
				
				    if (!err) {
				    	
						res.json(doc);
					} else {
						res.json(err);
					}
				   
				  });
				});


				app.post('/api/fcmappinglist', function(req, res) {
				console.log("received post");
				var fcmappingobj= new fcmapping(req.body);
				fcmappingobj.save(function(err,doc){

					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

					app.put('/api/fcmappinglist/:fcid', function(req, res) {
				console.log("received post");
				var fcmappingid=req.params.fcid;
				var fcmappingobj= new fcmapping(req.body);
				

				fcmapping.findOneAndUpdate({_id:fcmappingid},fcmappingobj,function(err,doc){
					
					if (!err) {
						res.json(doc);
					} else {
						res.json(err);
					}
					
				});
			});

					app.delete('/api/fcmappinglist/:fcid', function(req, res) {
						console.log("received delete");
						var fcmappingid=req.params.fcid;
					
						
						fcmapping.findOneAndRemove({"_id": fcmappingid},function(err,doc){
							if(!err)
								res.json(doc);
							else
								res.json(err);
						});
					});

		app.get('/api/fcnextsupplierlist/:fcid', function(req, res) {
			var fcmappingid=req.params.fcid;
			var fcObj= fc.findOne({'fc_id' :fcmappingid},function(err,doc){

				if(!err){

					fcmapping.find({'primary_fc':doc._id}).sort('priority').populate('secondary_fc').exec(function(err, doc) {
					
				 fcmapping.populate(doc, {
				    path: 'secondary_fc.suppliers',
				    model: 'Supplier'
				     },function(err, docs) {

			

						    if (!err) {

								res.json(doc);
							} else {

								console.log(err);

								res.json(err);
							}
						
				  });


				});




			}
			
		
			});

			});
		}