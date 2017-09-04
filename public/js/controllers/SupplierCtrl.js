angular.module('SupplierCtrl',['ui.bootstrap']).controller('SupplierController',
		['$scope','$uibModal','$http','$timeout','PendingDetailsService','$rootScope',
		function($scope,$uibModal,$http,$timeout,PendingDetailsService,$rootScope) {

				$scope.getAllSuppliers=function getAllSuppliers() 
				{
					$rootScope.apierror="";
				console.log("getAllSuppliers");
				$scope.angubusy = $http.get('/api/supplierlist').then(function(result) 
				{ 
					
					$scope.allSuppliers=result.data;
					$timeout(function()
					{
						$scope.$apply(function()
						{
							
							$scope.currentPage = 1;
							$scope.suppliersPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allSuppliers=result.data;
							$scope.currentSuppliers=$scope.allSuppliers.slice(0,25);
		  					$scope.totalSuppliers = $scope.allSuppliers.length;
		  					
						});
					
					},0);
		});
		}
			 

				  $scope.pageChanged = function() {
				  	
				  	if($scope.allSuppliers){
				  	var startIndex=($scope.currentPage-1)* $scope.suppliersPerPage;
				  	var endIndex=($scope.currentPage)* $scope.suppliersPerPage;
				    console.log("startIndex  "+ startIndex);
				    console.log("endIndex  "+ endIndex);
				    
				    $scope.currentSuppliers=$scope.allSuppliers.slice(startIndex,endIndex);
				}
					
				    console.log('Page changed to: ' + $scope.currentPage);
				  }

				  

			$scope.addSupplier = function() {
				$rootScope.apierror="";
				console.log("supplier is add suppliers",$scope.supplier);
				var that=this;

				$http.post('/api/supplierlist', $scope.supplier).then(function(result) {
					$scope.supplier="";
					that.getAllSuppliers();
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}
			$scope.editSupplier = function(id) {
				$rootScope.apierror="";
					console.log("edit supplier called");
					
					
					$scope.angubusy = $http.get('/api/supplierlist/' + id).success(function(result) {
					
					
					$scope.supplier = result;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}
			 
            $scope.updateSupplier = function (id) {
            	$rootScope.apierror="";
                var that=this;
            	
				$http.put('/api/supplierlist/'+id, $scope.supplier).success(function(result) {
					that.getAllUsers();
					$scope.supplier={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
               
		}
		

			$scope.deleteSupplier = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				var deleteSupplier = confirm('Are you absolutely sure you want to delete?');  
 				if (deleteSupplier) {
				$http.delete('/api/supplierlist/' + id).then(
						function(result) {
							that.getAllSuppliers();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});
					}
			
			}

			$scope.fileUploading= function(){
	
             var modalInstance=$uibModal.open({
				templateUrl: 'views/suppliersuploadfile.html',
				
 
              });
             

			}
			
			function convertCSVToJSON(csvdata){

			    var json = [];
			   
			    var csvArray = csvdata.split("\r\n");
			    
			    
			    var colnames=csvArray[0];
			    var csvColumns =colnames.split(",");
			     console.log("COL STRING",csvColumns);

			    csvArray.shift();
			   

			    csvArray.forEach(function(csvRowString) {
			    	console.log("rOW STRING",csvRowString);
			       	
			        var csvRow = csvRowString.split(",");

			        
			        jsonRow = new Object();
			        for ( var colNum = 0; colNum < csvRow.length; colNum++) {
			           
			            var colData = csvRow[colNum];
			            var colName=csvColumns[colNum];

			             
			            jsonRow[colName] = colData;
			    		
			        }
			        json.push(jsonRow);

			    });
			    console.log("final obj" , json);
			    return angular.fromJson(json);

			}
			
			
	$scope.handler=function(e,files){
		 e.stopImmediatePropagation();
			var that=this;
    var reader=new FileReader();
    reader.onload=function(e){
        var csvdata=reader.result;
        
       var output=convertCSVToJSON(csvdata);
     
      output.forEach(function(supplierCsvObj){
      			console.log("supplierCsvObj",supplierCsvObj);
       		
      	$http.post('/api/suppliercsvlist',supplierCsvObj).success(function(result){
       				
       				console.log("post result",result);
       				that.getAllSuppliers();
       			},function(err){

       		});



      });
       	console.log("getAllSuppliers()");	
       	that.getAllSuppliers();
    }
     reader.readAsText(files[0]);
}

			

			$scope.exportData=function(){

				var data=[];
      var header=['Supplier Code','Supplier Name','Address 1','Address 2','City','Phone 1','phone 2','Mobile','Weightage'];
      data.push(header);
      for(var i=0;i<$scope.allSuppliers.length;i++){
       var obj= $scope.allSuppliers[i];
       var record=[];
  		record.push(obj.cust_id);
       	record.push(obj.cust_name);
       	record.push(obj.add_1);
       	record.push(obj.add_2);
       	record.push(obj.city);
       	record.push(obj.phone_1);
       	record.push(obj.phone_2);
       	record.push(obj.mobile);
       	record.push(obj.weightage);
       	data.push(record);


      }
      alasql("SELECT * INTO CSV('suppliers.csv',{separator:','}) FROM ?",[data]);
  
    } 

			 $scope.open = function () {
			 	$scope.supplier={};
       			console.log("open supplier called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addsupplier.html',
                  controller: 'suppliermodalController',                
                 
                  resolve: {
                      supplier: function () {
                          return $scope.supplier;
                      }
                  }
              });

             modalInstance.result.then(function (supplier) {

             	

			      $scope.supplier = supplier;

			      $scope.addSupplier();
			    }, function () {
			      console.log("updated supplier",$scope.supplier);
			    });
			        
          }

          	 $scope.openedit = function (supplier) {
       			
          	 	console.log("Edit supplier",supplier);
       			$scope.supplier=supplier;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addsupplier.html',
                  controller: 'suppliermodalController',                
                 
                  resolve: {
                      supplier: function () {
                          return $scope.supplier;
                      }
                  }
              });

             modalInstance.result.then(function (supplier) {

             	

			      $scope.supplier = supplier;
			      $scope.updateSupplier(supplier._id);

			      
			    }, function () {
			      console.log("updated supplier",$scope.supplier);
			    });
			        
          }



          $scope.search= function() {
          	$rootScope.apierror="";
          	console.log("getAllSuppliers for search");
          	console.log($scope.suppliersearch);
				$http.post('/api/suppliersearch/',{'searchText':$scope.suppliersearch}).then(function(result) {
					console.log("searched record :",result);

					$timeout(function()
					{
						$scope.$apply(function()
						{
							
							$scope.currentPage = 1;
							$scope.suppliersPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allSuppliers=result.data;
							$scope.currentSuppliers=$scope.allSuppliers.slice(0,25);
		  					$scope.totalSuppliers = $scope.allSuppliers.length;

						});
					
					},0);
		     
		    }, function(err) {
		    	$rootScope.apierror="Sorry!!! Error Occured";
		    });
     }

          $scope.getCurrentStocks= function() {
          	$rootScope.apierror="";
          	
          		var stockData=PendingDetailsService.getStockData();


				$scope.angubusy = $http.get('/api/stocklist/'+stockData.supplierid+'/' +stockData.stockid).then(function(result) {
					console.log("searched record :",result);
					
					$scope.currentStockDetails=result.data;
		
		     
		    }, function(err) {
		    	$rootScope.apierror="Sorry!!! Error Occured";
		    });
     }

      }]);