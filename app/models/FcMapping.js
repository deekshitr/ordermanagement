var mongoose = require('mongoose');
console.log("creating FcMapping model");
var Schema = mongoose.Schema;

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('FcMapping', {
	primary_fc: {type: mongoose.Schema.Types.ObjectId, ref: 'Fc'},
	secondary_fc : {type: mongoose.Schema.Types.ObjectId, ref: 'Fc'},
	priority : {type : String}
	
	});