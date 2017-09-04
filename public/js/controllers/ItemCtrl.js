 angular.module('ItemCtrl',['ui.bootstrap']).controller('ItemController',
		function($scope,$uibModal,$http,$timeout,$rootScope) 

		{

			$scope.getAllItems=function getAllItems() 
			{
				console.log("getAllItems");
				  $scope.angubusy = $http.get('/api/itemlist').then(function(result) 
				{ 
					

					$scope.allItems=result.data;
					$timeout(function()
					{
						$scope.$apply(function()
            {
              
              $scope.currentPage = 1;
              $scope.itemsPerPage =25; 
              $scope.maxSize = 5; 
              $scope.allItems=result.data;
              $scope.currentItems=$scope.allItems.slice(0,25);
              $scope.totalItems = $scope.allItems.length;
                
            });
					
					},0);
		});		
		}

  $scope.pageChanged = function() {
  	console.log("pp all", $scope.allItems);
  	if($scope.allItems){
  	var startIndex=($scope.currentPage-1)* $scope.itemsPerPage;
  	var endIndex=($scope.currentPage)* $scope.itemsPerPage;
    console.log("startIndex  "+ startIndex);
    console.log("endIndex  "+ endIndex);
    
    $scope.currentItems=$scope.allItems.slice(startIndex,endIndex);
}
	
    console.log('Page changed to: ' + $scope.currentPage);
  }

   $scope.addItem = function() {
    $rootScope.apierror="";
    console.log("item in add items",$scope.item);
    var that=this;
    $http.post('/api/itemlist', $scope.item).then(function(result) {
     $scope.item="";
     that.getAllItems();
    }, function(err) {
        $rootScope.apierror="Sorry!!! Error Occured";
    });
    
   }
   $scope.editItem = function(id) {
    $rootScope.apierror="";
     console.log("edit item called");
     $scope.angubusy = $http.get('/api/itemlist/' + id).success(function(result) {
     
     
     $scope.item = result;
     
    }, function(err) {
        $rootScope.apierror="Sorry!!! Error Occured";
    });

   }
    
            $scope.updateItem = function (id) {
              $rootScope.apierror="";
                var that=this;
                       console.log($scope.item);
              $http.put('/api/itemlist/'+id, $scope.item).success(function(result) {
               that.getAllItems();
               $scope.item={};
              }, function(err) {
                $rootScope.apierror="Sorry!!! Error Occured";
                  });
                         
            }
  

         $scope.deleteItem = function(id) {
          $rootScope.apierror="";
          var that=this;
          
          var deleteItem = confirm('Are you absolutely sure you want to delete?');  
           if (deleteItem) {
          $http.delete('/api/itemlist/' + id).then(
            function(result) {
             that.getAllItems();
            }, function(err) {
                $rootScope.apierror="Sorry!!! Error Occured";
            });

          }
         }

        $scope.fileUploading= function(){
      
             var modalInstance=$uibModal.open({
        templateUrl: 'views/itemsuploadfile.html',
        
 
              });
             

      }
      
      function convertCSVToJSON(csvdata){
        

          var json = [];
         
          var csvArray = csvdata.split("\r\n");
          console.log("csv array",csvArray);

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
          
        $http.post('/api/itemcsvlist',stockCsvObj).success(function(result){
              
              console.log("post result",result);
              that.getAllItems();
            },function(err){

          });



      });
         
        that.getAllItems();
    }
     reader.readAsText(files[0]);
}


    $scope.open = function () {
      $scope.item={};
          console.log("open item called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/additem.html',
                  controller: 'itemmodalController',                
                 
                  resolve: {
                      item : function () {
                          return $scope.item;
                      }
                  }
              });

             modalInstance.result.then(function (item) {

              

         $scope.item = item;

         $scope.addItem();
       }, function () {
         console.log("updated item",$scope.item);
       });
           
          }

            $scope.openedit = function (item) {
          
              console.log("Edit item",item);
              $scope.item=item;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/additem.html',
                  controller: 'itemmodalController',                
                 
                  resolve: {
                      item: function () {
                          return $scope.item;
                      }
                  }
              });

             modalInstance.result.then(function (item) {

              
               
         $scope.item = item;
         $scope.updateItem(item._id);

         
       }, function () {
         console.log("updated item",$scope.item);
       });
           
          }

          $scope.exportData=function(){

        var data=[];
      var header=['Item ID','Item Name','Item Pack'];
      data.push(header);
      for(var i=0;i<$scope.allItems.length;i++){
       var obj= $scope.allItems[i];
       var record=[];
        record.push(obj.item_code);
        record.push(obj.item_name);
        record.push(obj.pack);
        
        data.push(record);


      }
      alasql("SELECT * INTO CSV('Items.csv',{separator:','}) FROM ?",[data]);
  
    } 



          $scope.search= function() {
            $rootScope.apierror="";

           console.log("getAllItems for search");
           console.log($scope.itemsearch);
		    $http.post('/api/itemsearch/',{'searchText':$scope.itemsearch}).then(function(result) {
		     console.log("searched record :",result);

          $timeout(function()
					{
						$scope.$apply(function()
						{
							
							$scope.currentPage = 1;
							$scope.itemsPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allItems=result.data;
							$scope.currentItems=$scope.allItems.slice(0,25);
		  					$scope.totalItems = $scope.allItems.length;
		  					
						});
					
					},0);
		     
		    }, function(err) {
            $rootScope.apierror="Sorry!!! Error Occured";
		    });
     }

      });
