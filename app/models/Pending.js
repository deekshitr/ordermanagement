// grab the mongoose module
var mongoose = require('mongoose');
console.log("creating Pending model");
var Schema = mongoose.Schema;

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Pending', {
	order_id: {type : String, required: true},
	version:  {type : Number},
	sku: {type : String, required: true},
	item_details: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
	ordered_qty: {type : Number, required: true},
	available_qty:  {type : Number, required: true},
	fullfilled_qty: {type : Number, required: true},
	fc: {type : String, required: true},
	agreed_supplier:[{supplier_id:{type:mongoose.Schema.Types.ObjectId,ref:'Supplier'},agreed_qty:{type:String}}]

	
});
