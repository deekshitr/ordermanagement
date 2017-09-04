angular.module('ViewModalCtrl',['ui.bootstrap']).controller(
		'viewmodalController',function ($scope, $uibModalInstance, view) {
		  
			console.log("viewmodalController" , view);
		  if(view)
		  	$scope.view=view;
		  else
		  $scope.view = {data: ''};

		  $scope.submit = function () {
		    console.log("ViewModalCtrl");
		    $uibModalInstance.close($scope.view);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
		 
      });