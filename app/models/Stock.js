// grab the mongoose module
var mongoose = require('mongoose');
console.log("creating Stock model");
var Schema = mongoose.Schema;
// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Stock', {
	sku : {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
	suppliersku : {type : String, required: true},
	supplier : {type: mongoose.Schema.Types.ObjectId, ref: 'Supplier'},
	stock : {type : String, required: true},
	active : {type : String}
	
});
