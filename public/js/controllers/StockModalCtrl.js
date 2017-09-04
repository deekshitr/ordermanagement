angular.module('StockModalCtrl',['ui.bootstrap']).controller(
		'stockmodalController',function ($scope, $uibModalInstance, stock) {


		  
			console.log("stockmodalController" , stock);
		  if(stock)
		  	$scope.stock=stock;
		  else
		  $scope.stock = {data: ''};

		  $scope.submit = function () {
		    console.log("StockModalCtrl");
		    $uibModalInstance.close($scope.stock);
		  };

		  $scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };

		  $scope.addSkuObj=function(selectedObj){
				console.log('selected SKU Object',selectedObj);
				//$scope.stock.sku=selectedObj.originalObject._id;

			}

			$scope.addSupplierObj=function(selectedObj){
				console.log('selected supplier Object',selectedObj);
				$scope.stock.supplier=selectedObj.originalObject._id;
				
			}

	
		 
      });