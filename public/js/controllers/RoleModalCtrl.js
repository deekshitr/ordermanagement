angular.module('RoleModalCtrl',['ui.bootstrap']).controller(
		'rolemodalController',function ($scope, $uibModalInstance, role) {
		  
			console.log("rolemodalController" , role);
		  if(role)
		  	$scope.role=role;
		   else
		  $scope.role = {data: ''};
		  $scope.submit = function () {
		    console.log("RoleModalCtrl");
		     console.log("RoleModalCtrl $scope.role",$scope.role);
		    $uibModalInstance.close($scope.role);

		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
		 
      });