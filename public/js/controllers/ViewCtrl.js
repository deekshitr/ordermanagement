angular.module('ViewCtrl',['ui.bootstrap']).controller(
		'ViewController',
		function($scope,$uibModal,$http,$timeout,$rootScope) {

				$scope.getAllViews=function getAllViews() {
					$rootScope.apierror="";
				console.log("getAllViews");
				$scope.angubusy = $http.get('/api/viewlist').then(function(result) {
					
					$scope.viewList = result.data;
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}

			$scope.addView = function() {
				$rootScope.apierror="";
				console.log("view is add views",$scope.view);
				var that=this;

				$http.post('/api/viewlist', $scope.view).then(function(result) {
					$scope.view="";
					that.getAllViews();
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}
			$scope.editView = function(id) {
				$rootScope.apierror="";
					console.log("edit view called");
					
					
					$scope.angubusy = $http.get('/api/viewlist/' + id).success(function(result) {
					
					
					$scope.view = result;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}
			 
            $scope.updateView = function (id) {
            	$rootScope.apierror="";
                var that=this;
            	
				$http.put('/api/viewlist/'+id, $scope.view).success(function(result) {
					that.getAllViews();
					$scope.view={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
               
		}
		

			$scope.deleteView = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				 var deleteView = confirm('Are you absolutely sure you want to delete?');  
 				if (deleteView) {
				$http.delete('/api/viewlist/' + id).then(
						function(result) {
							that.getAllViews();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});

					}
			}

			 $scope.open = function () {
			 	$scope.view={};
       			console.log("open view called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addview.html',
                  controller: 'viewmodalController',                
                 
                  resolve: {
                      view: function () {
                          return $scope.view;
                      }
                  }
              });

             modalInstance.result.then(function (view) {

             	

			      $scope.view = view;

			      $scope.addView();
			    }, function () {
			      console.log("updated view",$scope.view);
			    });
			        
          }

          	 $scope.openedit = function (view) {
       			
          	 	console.log("Edit view",view);
       			$scope.view=view;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addview.html',
                  controller: 'viewmodalController',                
                 
                  resolve: {
                      view: function () {
                          return $scope.view;
                      }
                  }
              });

             modalInstance.result.then(function (view) {

             	

			      $scope.view = view;
			      $scope.updateView(view._id);

			      
			    }, function () {
			      console.log("updated view",$scope.view);
			    });
			        
          }

          

          $scope.search = function() {
          	$rootScope.apierror="";
          	console.log("getAllViews for search");
          	
				$http.post('/api/viewsearch/',{'searchText':$scope.viewsearch}).then(function(result) {
					console.log("searched record :",result);

					$timeout(function() {
      					$scope.viewList = result.data;
    				}, 5);
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
  			
  
}


      });