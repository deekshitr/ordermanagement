angular.module('StockCtrl',['ui.bootstrap']).controller('StockController',['$scope','$uibModal','$http','$timeout','$filter','$rootScope',
	

		function($scope,$uibModal,$http,$timeout,$filter,$rootScope) {

			

			$scope.getAllStocks=function getAllStocks() {
				$rootScope.apierror="";
				console.log("getAllStocks");
				$scope.angubusy = $http.get('/api/stocklist').then(function(result) {
					
					$scope.stockList = result.data;
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}


  	  $scope.exportData = function () {
      var data=[];
      var header=['SKU','Item Name','Supplier SKU','Supplier ID','Supplier Name','Stock'];
      data.push(header);
      for(var i=0;i<$scope.stockList.length;i++){
      	var obj= $scope.stockList[i];
      	var record=[];
		record.push(obj.sku.item_code);
      	record.push(obj.sku.item_name);
      	record.push(obj.suppliersku);
      	record.push(obj.supplier.cust_id);
      	record.push(obj.supplier.cust_name);
      	record.push(obj.stock);
      	data.push(record);


      }
      alasql("SELECT * INTO CSV('stocks.csv',{separator:','}) FROM ?",[data]);
  
    }


			/*$scope.addSkuObj=function(selectedObj){
				console.log('selected SKU Object',selectedObj);
				$scope.skuObj=selectedObj;

			}*/

			

			$scope.addSupplierObj=function(selectedObj){
				console.log('selected supplier Object',selectedObj);
				$scope.supplierObj=selectedObj;
				
			}


			$scope.addStock = function() {
				$rootScope.apierror="";
				
				var that=this;
				$http.post('/api/stocklist', $scope.stock).then(function(result) {
					//$scope.stock="";
					that.getAllStocks();
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}
			$scope.editStock = function(id) {
				$rootScope.apierror="";
					console.log("edit stock called");
					$scope.angubusy = $http.get('/api/stocklist/' + id).success(function(result) {
					
					
					$scope.stock = result;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}
			 
            $scope.updateStock = function (id) {
            	$rootScope.apierror="";
                var that=this;
            	
				$http.put('/api/stocklist/'+id, $scope.stock).success(function(result) {
					that.getAllStocks();
					$scope.stock={};
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
               
		}
		

			$scope.deleteStock = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				var deleteStock = confirm('Are you absolutely sure you want to delete?');  
 				if (deleteStock) {
				$http.delete('/api/stocklist/' + id).then(
						function(result) {
							that.getAllStocks();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});
					}
			
			}

			$scope.fileUploading= function(){
			
             var modalInstance=$uibModal.open({
				templateUrl: 'views/stocksuploadfile.html',
				
 
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
     
      output.forEach(function(stockCsvObj){
      			console.log("stockobj",stockCsvObj);
       		
      	$http.post('/api/stockcsvlist',stockCsvObj).success(function(result){
       				
       				console.log("post result",result);
       				that.getAllStocks();
       			},function(err){

       		});



      });
       		
       	that.getAllStocks();
    }
     reader.readAsText(files[0]);
}

			 $scope.open = function () {
			 	$scope.stock={};
       			console.log("open stock called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addstock.html',
                  controller: 'stockmodalController',                
                 
                  resolve: {
                      stock : function () {
                          return $scope.stock;
                      }
                  }
              });

             modalInstance.result.then(function (stock) {

             	

			      $scope.stock = stock;

			      $scope.addStock();
			    }, function () {
			      console.log("updated stock",$scope.stock);
			    });
			        
          }

        $scope.exportData = function () {
      var data=[];
      var header=['SKU','Item Name','Supplier SKU','Supplier ID','Supplier Name','Stock'];
      data.push(header);
      for(var i=0;i<$scope.stockList.length;i++)
      	{
	       	var obj= $scope.stockList[i];
	       	var record=[];
	  		record.push(obj.sku.item_code);
	       	record.push(obj.sku.item_name);
	       	record.push(obj.suppliersku);
	       	record.push(obj.supplier.cust_id);
	       	record.push(obj.supplier.cust_name);
	       	record.push(obj.stock);
	       	data.push(record);
		}
      	alasql("SELECT * INTO CSV('stocks.csv',{separator:','}) FROM ?",[data]);
  
    }

          	 $scope.openedit = function (stock) {
       			
          	 	console.log("Edit stock",stock);
       			$scope.stock=stock;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addstock.html',
                  controller: 'stockmodalController',                
                 
                  resolve: {
                      stock: function () {
                          return $scope.stock;
                      }
                  }
              });

             modalInstance.result.then(function (stock) {

             	
             		
			      $scope.stock = stock;
			      $scope.updateStock(stock._id);

			      
			    }, function () {
			      console.log("updated stock",$scope.stock);
			    });
			        
          }


          $scope.search= function() {
          	$rootScope.apierror="";
          	console.log("getAllUsers for search");
          	console.log("searched text is",$scope.stocksearch);
				$http.post('/api/stocksearch/',{'searchText':$scope.stocksearch}).then(function(result) {
					console.log("searched record :",result);

					$timeout(function() {
      					$scope.stockList = result.data;
      					
      					console.log("result is",$scope.stockList);
    				}, 5);
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
  			
  
}


      }]);
