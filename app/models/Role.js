// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
console.log("creating Role model");

module.exports = mongoose.model('Role', {
	roleid : {type : String,required: true},
	rolename : {type : String,required: true},
	access : [{type: mongoose.Schema.Types.ObjectId, ref: 'View'}]
	
	});
