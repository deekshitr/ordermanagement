module.exports = function(app,db) {
	
	var fs=require('fs');
	var item= db.model('Item');
	
	require('events').EventEmitter.prototype._maxListeners =1000;
	
	var Converter = require("csvtojson").Converter;
	var converter = new Converter({checkType:false}); //for big csv data 
		 
		//record_parsed will be emitted each csv row being processed 
		converter.on("end_parsed", function (jsonObj) {
			
		   var len= jsonObj.length;

		   for(var i=0;i<len;i++){
			  
			  console.log("object " ,jsonObj[i]);


			   if(jsonObj[i].item_code=='item_code'){
			   	
			   	continue;
			   }


			   var itemobj= new item(jsonObj[i]);
			   itemobj.save(function(err,doc){

				if (!err) {
					console.log("object saved");
				} else {
					console.log('error',err);
					console.log("Error saving " +doc.item_code);
				}
				
			});
		}
	
		
		
		});

	var dir="C:/xampp/htdocs/mean/item";

	
		
  	 	
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        var processed =dir+'/processed/'+files[i]+'_done';
       
       if(!fs.lstatSync(name).isDirectory()){       
       		fs.createReadStream(name).pipe(converter);
       		fs.rename(name, processed);

   		}
}
   }