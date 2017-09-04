angular.module('UserCtrl',['ui.bootstrap']).controller('UserController',
		function($scope,$uibModal,$http,$timeout,$location,$route,$rootScope,$timeout,$window) {
				
				$scope.getAllUsers=function getAllUsers() {
					$rootScope.apierror="";
				console.log("getAllUsers");
				$scope.angubusy = $http.get('/api/userlist').then(function(result) {
					
					$scope.userList = result.data;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				$scope.angubusy = $http.get('/api/rolelist').then(function(result) {
					
					$scope.roleList = result.data;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

	
			}

			$scope.getLoggedUser=function getLoggedUser() {
				$rootScope.apierror="";
				
				$scope.angubusy = $http.get('/api/loggedinuser').then(function(result) {
					
					$scope.loggedInUser=result.data;
					$scope.menusList = result.data.role.access;
					console.log("menusList",$scope.menusList);

					
					}, function(err) {
						
					$rootScope.apierror="Sorry!!! Error Occured";

				});


			}

			$scope.addUser = function() {
				$rootScope.apierror="";
				console.log("user is add users",$scope.user);
				var that=this;

				$http.post('/api/userlist', $scope.user).then(function(result) {
					console.log("adduser result",result);
					$scope.user="";
					that.getAllUsers();
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}
			$scope.editUser = function(id) {
				$rootScope.apierror="";

					console.log("edit user called",id);
					$scope.angubusy = $http.get('/api/userlist/' + id).success(function(result) {
					
					$scope.user = result;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}

			
            $scope.updateUser = function (id) {
            	$rootScope.apierror="";
                var that=this;
            	console.log("$scope.user",$scope.user);
				$http.put('/api/userlist/'+id, $scope.user).success(function(result) {
					console.log("updateUser result",result);
					that.getAllUsers();
					$scope.user={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
               
		}
		

			$scope.deleteUser = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				var deleteUser = confirm('Are you absolutely sure you want to delete?');  
 				if (deleteUser) {
				$http.delete('/api/userlist/' + id).then(
						function(result) {
							that.getAllUsers();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});

					}
			}

			 $scope.open = function () {
			 	$scope.user={};
       			console.log("open user called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/adduser.html',
                  controller: 'usermodalController',                
                 scope: $scope,
                  resolve: {
                      user: function () {
                          return $scope.user;
                      }
                  }
              });

             modalInstance.result.then(function (user) {

			      $scope.user = user;

			      $scope.addUser();
			    }, function () {
			      console.log("updated user",$scope.user);
			    });
			        
          }

          	 $scope.openedit = function (user) {
       			
          	 	console.log("Edit user",user);
       			$scope.user=user;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/adduser.html',
                  controller: 'usermodalController',                
                  scope: $scope,
                  resolve: {
                      user: function () {
                          return $scope.user;
                      }
                  }
              });

             modalInstance.result.then(function (user) {

             	

			      $scope.user = user;
			      $scope.updateUser(user._id);

			      
			    }, function () {
			      console.log("updated user",$scope.user);
			    });
			        
          }

          

          $scope.search = function() {
          	$rootScope.apierror="";
          	console.log("getAllUsers for search");
          	
				$http.post('/api/usersearch/',{'searchText':$scope.usersearch}).then(function(result) {
					console.log("searched record :",result);

					$timeout(function() {
      					$scope.userList = result.data;
    				}, 5);
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
  			
  
			}

			$scope.logout = function() {
					console.log("logout called");
					$http.post('/api/logout').success(function(result){
						
			                $window.location.reload();
			                
			            });
            }
 
});