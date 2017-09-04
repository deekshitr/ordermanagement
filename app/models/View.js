var mongoose = require('mongoose');
console.log("creating View model");

module.exports = mongoose.model('View', {
	id : {type : String,required: true},
	name : {type : String,required: true},
	path : {type : String,required: true},
	
});
