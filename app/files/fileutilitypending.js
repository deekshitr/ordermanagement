module.exports = function(app,db) {
	
	var fs=require('fs');
	var pending= db.model('Pending');
	var itemMaster= db.model('Item');
	
	
	require('events').EventEmitter.prototype._maxListeners =1000;
	
	var Converter = require("csvtojson").Converter;
	var converter = new Converter({checkType:false}); //for big csv data 
		 
		//record_parsed will be emitted each csv row being processed 
		converter.on("end_parsed", function (jsonObj) {
			var that=this;
		   var len= jsonObj.length;

		  jsonObj.forEach(function(penObj){
		  	 if(penObj.order_id!='order_id'){
			   penObj.fc='101';
			   if(penObj.available_qty==''){
			   		penObj.available_qty=0;
			   		penObj.fullfilled_qty=0;
			   	}
			   	else{
			   		penObj.fullfilled_qty=penObj.available_qty;
			   	}
			   console.log("object " ,penObj);
			   var sku= penObj.sku;
			   
			    itemMaster.findOne({'item_code':sku},function(err,obj){
			   		
			   		var pendingobj= new pending(penObj);
			   		pendingobj.item_details=obj._id;
			   		
			   		
			   		pendingobj.save(function(err,doc){

						if (!err) {
							console.log("object saved");
						} else {
							console.log('error',err);
							console.log("Error saving " ,doc);
						}
				
					});

			   });
			}

			   
		});
	
		
		});


			


	

	//var file = require('fs').createWriteStream('/path/to/pendings.csv');

       //s3.getObject(params).createReadStream().pipe(converter);
 
}