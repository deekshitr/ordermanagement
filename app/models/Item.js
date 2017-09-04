// grab the mongoose module
var mongoose = require('mongoose');
console.log("creating Item model");
// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Item', {
	item_code: {type : String, required: true},
	item_name : {type : String, required: true},
	pack : {type : String}
	
	});
