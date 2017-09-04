	// modules =================================================
	var express = require('express');
	var app = express();
	var mongoose=require('mongoose');
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override');
	var passport = require('passport');
	var session=require("express-session");
	var flash = require('connect-flash');
	var cookieParser = require('cookie-parser');
	
	
	var db=mongoose.createConnection('mongodb://localhost/order');

	// set our port
	var port = process.env.PORT || 9090; 

	var User=require('./app/models/User');
	var Stock=require('./app/models/Stock');
	var Item=require('./app/models/Item');
	var Supplier=require('./app/models/Supplier');
	var Pending=require('./app/models/Pending');
	var View=require('./app/models/View');
	var Role=require('./app/models/Role');
	var Fc=require('./app/models/Fc');
	var FcMapping=require('./app/models/FcMapping');
	var ExemptedSupp=require('./app/models/ExemptedSupp');
	//var awsUtility=require('./app/files/awsS3Utility');

			
	// required for passport
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use(cookieParser()); // read cookies (needed for auth)
	app.use(session({ secret: 'ordermanagementsystem',resave:false,saveUninitialized:false })); // session secret
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	//app.use(cors());
  
	

	// config files
	app.use(express.static(__dirname + '/public')); 

	// import UserMgmt
	require('./app/dao/userMgmt')(app,db);
	require('./app/dao/pendingMgmt')(app,db);
	require('./app/dao/stockMgmt')(app,db);
	require('./app/dao/supplierMgmt')(app,db);
	require('./app/dao/itemMgmt')(app,db);
	require('./app/dao/roleMgmt')(app,db);
	require('./app/dao/viewMgmt')(app,db);
	require('./app/dao/fcMgmt')(app,db);
	require('./app/dao/fcmappingMgmt')(app,db);
	require('./app/dao/authenticate')(passport,db);
	require('./app/dao/exempsuppMgmt')(app,db);
	console.log('abt to load uitility');
	//require('./app/files/awsS3Utility')();
	console.log('loaded uitility');
	//awsUtility.listAllKeys();

	//var filemgmtpending=require('./app/files/fileutilitypending')(app,db);
	//var filemgmtsupplier=require('./app/files/fileutilitysupplier')(app,db);
	//var filemgmtitem=require('./app/files/fileutilityitem')(app,db);




	// routes ==================================================
	require('./app/routes')(app,passport); // pass our application into our routes

	// start app ===============================================
	app.listen(port);
	console.log('Order Managment System is running on port :' + port); // shoutout to the user
	exports = module.exports = app; // expose app
