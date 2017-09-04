var mongoose = require('mongoose');
var Schema = mongoose.Schema;
console.log("creating User model");
module.exports = mongoose.model('User', {
	username : {type : String,required: true},
	firstname : {type : String,required: true},
	lastname : {type : String,required: true},
	email : {type : String,required: true,lowercase: true},
	password : {type : String,required: true},
	role:{type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
	issuper:{type: String,required: true}
	
	
});
