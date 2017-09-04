angular.module('UserModalCtrl',['ui.bootstrap']).controller(
		'usermodalController',function ($scope, $uibModalInstance, user) {
		  
			console.log("usermodalController" , user);
		  if(user)
		  	$scope.user=user;
		  else
		  $scope.user = {data: ''};

		  $scope.submit = function () {

		    console.log("UserModalCtrl",$scope.user);
		    $scope.user.role=$scope.user.role._id;
		    $uibModalInstance.close($scope.user);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
		 
      });