angular.module('FCMappingModelCtrl',['ui.bootstrap']).controller(
		'fcmappingmodalController',function ($scope, $uibModalInstance, fcmapping) {

		
		  if(fcmapping)
		  	$scope.fcmapping=fcmapping;
		  else
		  $scope.fcmapping = {data: ''};

		  $scope.submit = function () {
		    
		    $uibModalInstance.close($scope.fcmapping);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };

		  $scope.addPrimaryFcObj=function(selectedObj){
				console.log('selected Primary Fc Object',selectedObj);
				$scope.fcmapping.primary_fc=selectedObj.originalObject._id;

			}

			$scope.addSecondaryFcObj=function(selectedObj){
				console.log('selected Secondary Fc Object',selectedObj);
				$scope.fcmapping.secondary_fc=selectedObj.originalObject._id;
				
			}
		 
      });