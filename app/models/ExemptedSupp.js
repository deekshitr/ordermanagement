// grab the mongoose module
var mongoose = require('mongoose');
console.log("creating ExemptedSupp model");

// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('ExemptedSupp', {
	sku: {type:String, required: true},
	supplierid:{type:String,required: true}
});