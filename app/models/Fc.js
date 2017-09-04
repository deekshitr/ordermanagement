// grab the mongoose module
var mongoose = require('mongoose');
console.log("creating Fc model");
// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Fc', {
	fc_id: {type : String, required: true},
	fc_location: {type : String, required: true},
	suppliers :[{type: mongoose.Schema.Types.ObjectId, ref: 'Supplier'}] 
	
	});
