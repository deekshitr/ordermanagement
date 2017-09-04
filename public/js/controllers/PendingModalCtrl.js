angular.module('PendingModalCtrl',['ui.bootstrap']).controller(
		'pendingmodalController',function ($scope, $uibModalInstance, pending) {
		  
			console.log("pendingmodalController" , pending);
		  if(pending)
		  	$scope.pending=pending;
		  else
		  $scope.pending = {data: ''};

		  $scope.submit = function () {
		    console.log("PendingModalCtrl");
		    $uibModalInstance.close($scope.pending);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
		 
      });