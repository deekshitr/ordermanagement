// grab the mongoose module
var mongoose = require('mongoose');
console.log("creating Supplier model");
// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Supplier', {
	cust_id: {type : String, required: true},
	cust_name : {type : String, required: true},
	add_1 : {type : String},
	add_2: {type : String},
	add_3: {type : String},
	city: {type : String},
	pin: {type : String},
	phone_1: {type : String},
	phone_2: {type : String},
	mobile: {type : String},
	email: {type : String},
	weightage:{type : Number}
	
});
