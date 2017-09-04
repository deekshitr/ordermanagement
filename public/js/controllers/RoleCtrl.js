angular.module('RoleCtrl',['ui.bootstrap']).controller(
		'RoleController',
		function($scope,$uibModal,$http,$timeout,$rootScope) {
				
				$scope.getAllRoles=function getAllRoles() {
					$rootScope.apierror="";
				console.log("getAllRoles");
				$scope.angubusy = $http.get('/api/rolelist').then(function(result) {
					
					$scope.roleList = result.data;
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}

			$scope.getAllMenus=function getAllMenus() 
			{
				$rootScope.apierror="";

			    console.log("getAllMenus");
			    $scope.angubusy = $http.get('/api/viewlist').then(function(result) {
			     
			     $scope.viewList = result.data;
			    }, function(err) {
			     	$rootScope.apierror="Sorry!!! Error Occured";
			    });

			   }



			$scope.addRole = function() {
				$rootScope.apierror="";
				
				var that=this;

				$http.post('/api/rolelist', $scope.role).then(function(result) {
					$scope.role="";
					that.getAllRoles();
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}

			$scope.checkAddView = function(viewid) {
				
				var value=-1;
				
				var accesslength=$scope.role.access.length;

				
				for(var i=0;i<accesslength;i++)
				{

					console.log("$scope.role.access[i]",$scope.role.access[i]);

					if($scope.role.access[i]._id==viewid)
						value=0;
					
				}
			
				
				 if (value == -1) { 
				   return false;
				  }
				  else {
				   return true;
				  }
				
				}

				$scope.checkRemoveView = function(viewid) {
					var value=0;
				var accesslength=$scope.role.access.length;

				for(var i=0;i<accesslength;i++)
				{
					console.log("$scope.role.access[i]",$scope.role.access[i]);
					if($scope.role.access[i]._id==viewid)
						value=-1;
					
				}
		
				
				 if (value == -1) { 
				   return false;
				  }
				  else {
				   return true;
				  }
				
				}

			
			$scope.addView=function(viewid){
			
				$rootScope.apierror="";
			console.log("submit", viewid);
			
			var newsupp={'_id': viewid};


			$http.put('/api/addviewlist/'+$scope.role._id, newsupp)
			.success(function(result) {

				$scope.role={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
			}

			$scope.removeView = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				var existingview={'_id': id};
				console.log("current role",$scope.role);
				var deleteUser = confirm('Are you absolutely sure you want to remove?');  
 				if (deleteUser) {
				$http.put('/api/removeviewlist/'+$scope.role._id, existingview)
				.success(function(result) {
					
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

					}
			}
				

			$scope.editRole = function(id) {
				$rootScope.apierror="";
					console.log("edit role called");
					$scope.angubusy = $http.get('/api/rolelist/' + id).success(function(result) {
					
					$scope.role = result;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}

			 
            $scope.updateRole = function (roleid) {
            	$rootScope.apierror="";
                var that=this;

            	console.log($scope.role);
				$http.put('/api/rolelist/'+roleid, $scope.role).success(function(result) {

					that.getAllRoles();
					$scope.role={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
               
		}
		

			$scope.deleteRole = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				 var deleteRole = confirm('Are you absolutely sure you want to delete?');  
 				if (deleteRole) {
				$http.delete('/api/rolelist/' + id).then(
						function(result) {
							that.getAllRoles();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});
				}
			
			}

			 $scope.open = function () {
			 	$scope.role={};
       			console.log("open role called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addrole.html',
                  controller: 'rolemodalController',                
                 
                  resolve: {
                      role: function () {
                          return $scope.role;
                      }
                  }
              });

             modalInstance.result.then(function (role) {

             	

			      $scope.role = role;

			      $scope.addRole();
			    }, function () {
			      console.log("updated role",$scope.role);
			    });
			        
          }

          	 $scope.openedit = function (role) {
       			
          	 	console.log("Edit role",role);
       			$scope.role=role;
             	var modalInstance=$uibModal.open({
                  templateUrl: 'views/addrole.html',
                  controller: 'rolemodalController',                
                 
                  resolve: {
                      role: function () {
                          return $scope.role;
                      }
                  }
              });

             modalInstance.result.then(function (role) {

             	

			      $scope.role = role;
			      $scope.updateRole(role._id);

			      
			    }, function () {
			      console.log("updated role",$scope.role);
			    });
			        
          }
          $scope.search = function() {
          	$rootScope.apierror="";
          	console.log("getAllRoles for search");
          	
				$http.post('/api/rolesearch/',{'searchText':$scope.rolesearch}).then(function(result) {
					console.log("searched record :",result);

					$timeout(function() {
      					$scope.roleList = result.data;
    				}, 5);
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
  			
  
            }


             $scope.openviewedit = function (role) {
       			
          	 	console.log("Edit role",role);
       			$scope.role=role;
             	var modalInstance=$uibModal.open({
                  templateUrl: 'views/roleviews.html',
                  controller: 'rolemodalController',                
                 
                  resolve: {
                      role: function () {
                          return $scope.role;
                      }
                  }
              });

             modalInstance.result.then(function (role) {

			      $scope.role = role;
			     $scope.getAllRoles();

			      
			    }, function () {
			      console.log("updated role",$scope.role);
			    });
			        
          }
		});