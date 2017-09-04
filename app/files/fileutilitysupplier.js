module.exports = function(app,db) {
	
	var fs=require('fs');
	var supplier= db.model('Supplier');
	var fc=db.model('Fc');
	require('events').EventEmitter.prototype._maxListeners =1000;
	
	var Converter = require("csvtojson").Converter;
	var converter = new Converter({checkType:false}); //for big csv data 
		 
		//record_parsed will be emitted each csv row being processed 
		converter.on("end_parsed", function (jsonObj) {
			
		   var len= jsonObj.length;

		   jsonObj.forEach(function(suppObj){

		   	 if(suppObj.cust_id!='cust_id'){
			 console.log("object " ,suppObj);
			   var supplierobj= new supplier(suppObj);
			   
			   var city=suppObj.city;
			   if(city=='DELHI' || city=='NEW DELHI')
			   		city='DELHI';
			   	else if (city=='SECUNDERABAD')
			   		city='HYDERABAD';

			   	var fc_id='';
			     		
			   		supplierobj.save(function(err,doc){

				if (!err) {
					 fc.findOne({'fc_location': city},function(err,fcObj){
			   		
					console.log("object saved",fcObj);
					if(fcObj){

					fcObj.suppliers.push(doc._id);
					fcObj.save();
				}		
				});
					}
				 else {
					
					console.log('error',err);
					console.log("Error saving " +doc._id);
					}
					})
			}

	});
});				

	var dir="C:/xampp/htdocs/mean/supplier";

	
		console.log("inside fileutility > filelist");
  	 	
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        var processed =dir+'/processed/'+files[i]+'_done';
       
       if(!fs.lstatSync(name).isDirectory()){       
       		fs.createReadStream(name).pipe(converter);
       		fs.rename(name, processed);

   		}
}
    
  	 

	/*var j = schedule.scheduleJob('* 1 * * *', function(){

	var Converter = require("csvtojson").Converter;
		var converter = new Converter({constructResult:false}); //for big csv data 
		 
		//record_parsed will be emitted each csv row being processed 
		converter.on("record_parsed", function (jsonObj) {
		   console.log(jsonObj); //here is your result json object 
		});
		 
		require("request").get("http://csvwebserver").pipe(converter);

		});
*/
}