// module.exports = function() {

// 	console.log("awss3utility");
// var AWS = require('aws-sdk');
// AWS.config.update({accessKeyId: 'AKIAJFSCHOWDEMK4XDGQ', secretAccessKey: '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',region: 'us-east-1'});
// 	console.log("connected to aws server");
// 	var s3 = new AWS.S3();
// 	var params = {Bucket: 'zigy-stage-static', Delimiter: '/',Marker : 'marker',MaxKeys:100};
// 	console.log('s3 obje', s3);

// 	var allKeys = [];
// 		console.log("s3params",params)
			
// 			  s3.listObjects(params, function(err, data){
// 			  	console.log("s3data",data);
// 			    allKeys.push(data.Contents);

			    
// 			  });
			

// }