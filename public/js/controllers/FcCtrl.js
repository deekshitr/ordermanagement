angular.module('FcCtrl',['ui.bootstrap','ngTableToCsv']).controller('FcController',
	['$scope','$uibModal','$http','$timeout','$location','SupplierDetailsService','$rootScope',
		function($scope,$uibModal,$http,$timeout,$location,SupplierDetailsService,$rootScope) {

				$scope.getAllFcs=function getAllFcs() {
					$rootScope.apierror="";
				
				
				$scope.angubusy = $http.get('/api/fclist').then(function(result) 
				{ 
					console.log("getAllFcs");
				
					
					$scope.fcList = result.data;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
			}

			$scope.addFc = function() {
				$rootScope.apierror="";
				console.log("fc is add fcs",$scope.fc);
				var that=this;

				$http.post('/api/fclist', $scope.fc).then(function(result) {
					console.log("adduser result",result);
					$scope.fc="";
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}
			$scope.editFc = function(id) {
				$rootScope.apierror="";
					console.log("edit fc called");
					$scope.angubusy = $http.get('/api/fclist/' + id).success(function(result) {
					
					$scope.fc = result;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}

			
            $scope.updateFc = function (id) {
            	$rootScope.apierror="";
                var that=this;
            	console.log($scope.fc);
				$http.put('/api/fclist/'+id, $scope.fc).success(function(result) {
					that.getAllfcs();
					$scope.fc={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
			
               
		}
		

			$scope.deleteFc = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				var deleteUser = confirm('Are you absolutely sure you want to delete?');  
 				if (deleteUser) {
				$http.delete('/api/fclist/' + id).then(
						function(result) {
							that.getAllFcs();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});

					}
			}

			 $scope.getSupplierDetails=function(){

		      	var selectedFc=SupplierDetailsService.getData();
		      $scope.supplierDetailsList=selectedFc.suppliers;
		      
		     
					$timeout(function()
					{
						$scope.$apply(function()
						{
							console.log("suppliers is",$scope.supplierDetailsList);
							$scope.currentPage = 1;
							$scope.suppliersPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.supplierDetailsList=selectedFc.suppliers;
							$scope.currentSuppliers=$scope.supplierDetailsList.slice(0,25);
		  					$scope.totalSuppliers = $scope.supplierDetailsList.length;
		  					
						});
					
					},0);
		}	
	
			

				  $scope.pageChanged = function() {
				  	
				  	if($scope.supplierDetailsList){
				  	var startIndex=($scope.currentPage-1)* $scope.suppliersPerPage;
				  	var endIndex=($scope.currentPage)* $scope.suppliersPerPage;
				    console.log("startIndex  "+ startIndex);
				    console.log("endIndex  "+ endIndex);
				    
				    $scope.currentSuppliers=$scope.supplierDetailsList.slice(startIndex,endIndex);
				}
					
				    console.log('Page changed to: ' + $scope.currentPage);
				  }
    
		  


      		$scope.showDetails= function (fc) {
      			$scope.currentFC=fc;
      			SupplierDetailsService.addData(fc);
		   

		   	           $location.path('/suppliersdetails');
		    }


			 $scope.open = function () {
			 	$scope.fc={};
       			console.log("open fc called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addfc.html',
                  controller: 'fcmodalController',                
                 scope: $scope,
                  resolve: {
                      fc: function () {
                          return $scope.fc;
                      }
                  }
              });

             modalInstance.result.then(function (fc) {

             	console.log(fc);

			      $scope.fc = fc;

			      $scope.addFc();
			    }, function () {
			      console.log("updated fc",$scope.fc);
			    });
			        
          }
         
          $scope.openSupplier = function () {
          		$rootScope.apierror="";
          	$scope.currentFC=SupplierDetailsService.getData();

       			console.log("open supplier called",$scope.currentFC);
             var modalInstance=$uibModal.open({
             	  scope:$scope,
                  templateUrl: 'views/AddSuppliertoFC.html',
                    controller: 'SuppliertoFcController', 
                                 
                 
                  resolve: {
                      supplier : function () {
                          return $scope.supplier;
                      }
                  }
              });

             modalInstance.result.then(function (supplier) {

             	
             	$scope.addSuppliertoFC(supplier);

			     
			    }, function () {
			      $rootScope.apierror="Sorry!!! Error Occured";
			    });
			        
          }
           $scope.addSuppliertoFC=function(supplierid){
			$rootScope.apierror="";
			
			var newsupp={'_id': supplierid};


			$http.put('/api/addsuppfc/'+$scope.currentFC._id, newsupp)
			.success(function(result) {
				
				$scope.fc={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
			}



          	 $scope.openedit = function (fc) {
       			
          	 	console.log("Edit fc",fc);
       			$scope.fc=fc;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addfc.html',
                  controller: 'fcmodalController',                
                  scope: $scope,
                  resolve: {
                      fc: function () {
                          return $scope.fc;
                      }
                  }
              });

             modalInstance.result.then(function (fc) {

             	

			      $scope.fc = fc;
			      $scope.updateFc(fc._id);

			      
			    }, function () {
			      console.log("updated fc",$scope.fc);
			    });
			        
          }
          $scope.removeSupplier = function(id) {
          	$rootScope.apierror="";
				var that=this;
				
				$scope.currentFC=SupplierDetailsService.getData();
				var exitingsupp={'_id': id};
				console.log("current fc",$scope.currentFC);
				var deleteUser = confirm('Are you absolutely sure you want to remove?');  
 				if (deleteUser) {
				$http.put('/api/removesuppfc/'+$scope.currentFC._id, exitingsupp)
				.success(function(result) {

					that.getSupplierDetails();

				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

					}
			}

          

          $scope.search = function() {
          	$rootScope.apierror="";
          	
          	console.log($scope.fcsearch);
				$http.post('/api/addsuppfc/',{'searchText':$scope.fcsearch}).then(function(result) {
					console.log("searched record :",result);

					$timeout(function() {
      					$scope.currentFC = result.data;
    				}, 5);
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
  			
  
			}

	}]);