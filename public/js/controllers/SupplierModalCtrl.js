angular.module('SupplierModalCtrl',['ui.bootstrap']).controller(
		'suppliermodalController',function ($scope, $uibModalInstance, supplier) {
		  
			console.log("suppliermodalController" , supplier);
		  if(supplier)
		  	$scope.supplier=supplier;
		  else
		  $scope.supplier = {data: ''};

		  $scope.submit = function () {
		    console.log("SupplierModalCtrl");
		    $uibModalInstance.close($scope.supplier);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
		 
      });