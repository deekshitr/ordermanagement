angular.module('ItemModalCtrl',['ui.bootstrap']).controller(
		'itemmodalController',function ($scope, $uibModalInstance, item) {
		  
			console.log("itemmodalController" , item);
		  if(item)
		  	$scope.item=item;
		  else
		  $scope.item = {data: ''};

		  $scope.submit = function () {
		    console.log("ItemModalCtrl");
		    $uibModalInstance.close($scope.item);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
		 
      });