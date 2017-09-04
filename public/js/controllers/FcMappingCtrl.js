angular.module('FcMappingCtrl',['ui.bootstrap']).controller('FcMappingController',
	
		function($scope,$uibModal,$http,$timeout,$rootScope) {

				
				$scope.getAllFcMappings=function getAllFcMappings() {
					$rootScope.apierror="";
				console.log("getAllFcMappings");
				$scope.angubusy = $http.get('/api/fcmappinglist/').then(function(result) {

					
					$scope.fcMappingList = result.data;
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}

			$scope.addPrimaryFcObj=function(selectedObj){
				console.log('selected Primary Fc Object',selectedObj);
				$scope.primaryfcObj=selectedObj;

			}

			$scope.addSecondaryFcObj=function(selectedObj){
				console.log('selected Secondary Fc Object',selectedObj);
				$scope.secondaryfcObj=selectedObj;
				
			}


			$scope.addFcMapping = function() {
				$rootScope.apierror="";
				
				var that=this;
				$http.post('/api/fcmappinglist', $scope.fcmapping).then(function(result) {
					$scope.fcmapping="";
					that.getAllFcMappings();
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}
			$scope.editFcMapping = function(id) {
				$rootScope.apierror="";
					console.log("edit fcmapping called");
					$scope.angubusy = $http.get('/api/fcmappingedit/' + id).success(function(result) {
					
					
					$scope.fcmapping = result;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}
			 
            $scope.updateFcMapping = function (id) {
            	$rootScope.apierror="";
                var that=this;
            	
				$http.put('/api/fcmappinglist/'+id, $scope.fcmapping).success(function(result) {
					that.getAllFcMappings();
					$scope.fcmapping={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
               
		}
		

			$scope.deleteFcMapping = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				var deleteStock = confirm('Are you absolutely sure you want to delete?');  
 				if (deleteStock) {
				$http.delete('/api/fcmappinglist/' + id).then(
						function(result) {
							that.getAllFcMappings();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});
					}
			
			}

			 $scope.open = function () {
			 	$scope.fcmapping={};
       			console.log("open fcmapping called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addfcmapping.html',
                  controller: 'fcmappingmodalController',                
                 
                  resolve: {
                      fcmapping : function () {
                          return $scope.fcmapping;
                      }
                  }
              });

             modalInstance.result.then(function (fcmapping) {

             	

			      $scope.fcmapping = fcmapping;

			      $scope.addFcMapping();
			    }, function () {
			      console.log("updated fcmapping",$scope.fcmapping);
			    });
			        
          }

          	 $scope.openedit = function (fcmapping) {
       			
          	 	console.log("Edit fcmapping",fcmapping);
       			$scope.fcmapping=fcmapping;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addfcmapping.html',
                  controller: 'fcmappingmodalController',                
                 
                  resolve: {
                      fcmapping: function () {
                          return $scope.fcmapping;
                      }
                  }
              });

             modalInstance.result.then(function (fcmapping) {

             	
             		
			      $scope.fcmapping = fcmapping;
			      $scope.updateFcMapping(fcmapping._id);

			      
			    }, function () {
			      console.log("updated fcmapping",$scope.fcmapping);
			    });
			        
          }



      });