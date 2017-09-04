angular.module('SuppliertoFcModalCtrl',['ui.bootstrap']).controller(
		'SuppliertoFcController',function ($scope, $uibModalInstance, supplier) {


		  console.log('current scope',$scope);
			console.log("SuppliertoFcController" , supplier);
		  if(supplier)
		  	$scope.supplier=supplier;
		  else
		  $scope.supplier = {};

			$scope.addSupplierObj=function(selectedObj){
				console.log('selected supplier Object',selectedObj);
				$scope.supplier=selectedObj.originalObject._id;
				
			}


			 $scope.submit = function () {
			    console.log("StockModalCtrl");
			    $uibModalInstance.close($scope.supplier);
			  }

		
		 $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  }

		});
	