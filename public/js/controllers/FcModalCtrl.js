angular.module('FcModalCtrl',['ui.bootstrap']).controller(
		'fcmodalController',function ($scope, $uibModalInstance, fc) 
		{
			console.log("fcmodalController" , fc);
			if(fc)
			$scope.fc=fc;
			else
			$scope.fc = {data: ''};
			$scope.submit = function () 
			{
			    console.log("FcModalCtrl");
			    $uibModalInstance.close($scope.fc);
		  	};
			$scope.cancel = function () 
			{
		    	$uibModalInstance.dismiss('cancel');
		  	};
		});