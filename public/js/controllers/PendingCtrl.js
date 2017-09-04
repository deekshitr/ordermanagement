angular.module('PendingCtrl',['ui.bootstrap']).controller('PendingController',
		['$scope','$uibModal','$http','$timeout','$location','PendingDetailsService','PendingItemDetailsService','$q','$rootScope','$route',
		function($scope,$uibModal,$http,$timeout,$location,PendingDetailsService,PendingItemDetailsService,$q,$rootScope,$route) {

			$scope.getAllPendings=function getAllPendings() {
				$rootScope.apierror="";
				console.log("getAllPendings");
			$scope.angubusy = $http.get('/api/pendinglist').then(function(result) 
				{ 
					
					$scope.allPendings=result.data;
					$timeout(function()
					{
						$scope.$apply(function()
						{
							
							$scope.currentPage = 1;
							$scope.pendingsPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allPendings=result.data;
							$scope.currentPendings=$scope.allPendings.slice(0,25);
		  					$scope.totalPendings = $scope.allPendings.length;
		  					
						});
					
					},0);
				});	
	
				}
			

			

			  $scope.pageChanged = function() {
			  	
			  	if($scope.allPendings){
			  	var startIndex=($scope.currentPage-1)* $scope.pendingsPerPage;
			  	var endIndex=($scope.currentPage)* $scope.pendingsPerPage;
			    console.log("startIndex  "+ startIndex);
			    console.log("endIndex  "+ endIndex);
			    
			    $scope.currentPendings=$scope.allPendings.slice(startIndex,endIndex);
			}
				
			    console.log('Page changed to: ' + $scope.currentPage);
			  }

			$scope.addPending = function() {
				$rootScope.apierror="";
				console.log("pending is add pendings",$scope.pending);
				var that=this;

				$http.post('/api/pendinglist', $scope.pending).then(function(result) {
					$scope.pending="";
							that.getAllPendings();

				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
				
			}

			$scope.editPending = function(id) {
				$rootScope.apierror="";
					console.log("edit pending called");
					
					$scope.angubusy = $http.get('/api/pendinglist/' + id).success(function(result) 
					{
					
					$scope.pending = result;
					}, 
					function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});

			}
			 
            $scope.updatePending = function (pending) {
            	$rootScope.apierror="";
            	
                var that=this;
                var updatePending = confirm('Are you absolutely sure you want to update?');  
 				if (updatePending) {
            	
            	var suppInfo={'supplier_id':$scope.currentSupplier._id,'agreed_qty':$scope.currentPending.fullfilled_qty};
            	console.log("$scope.currentPending.fullfilled_qty",$scope.currentPending.fullfilled_qty);
            	console.log("old_fullfilled_qty",$scope.old_fullfilled_qty);
            	var fullfilled_qtyCheck=parseInt($scope.currentPending.fullfilled_qty)+parseInt($scope.old_fullfilled_qty);
            	console.log("fullfilled_qtyCheck",fullfilled_qtyCheck);
            	if($scope.currentPending.ordered_qty>=fullfilled_qtyCheck){
				$http.put('/api/pendinglistaddsupp/'+$scope.currentPending._id, suppInfo).success(function(result) {
					console.log("update supplier",result);
				if($scope.currentSupplier.weightage)
					$scope.currentSupplier.weightage=parseInt($scope.currentSupplier.weightage)+1;
				else
					$scope.currentSupplier.weightage="0";
				
				$http.put('/api/supplierlist/'+$scope.currentSupplier._id,$scope.currentSupplier).success(function(result) {
					console.log("incremented the supplier weightage");
					that.getOrderDetails();
					$scope.currentPending={};
					$scope.currentSupplier=null;
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
			

			},function(err){
				$rootScope.apierror="Sorry!!! Error Occured";	
			});
				}else{

				alert("Sorry!!!!fullfilled qty is greater than ordered qty");

			}
			}
               
		}


		$scope.updateItemPending = function () {

         		$rootScope.apierror="";
                var that=this;
                 var updateItemPending = confirm('Are you absolutely sure you want to update?');  
 				var  totalavailableqty=$scope.currentPending.total_available_qty;
            	var totalavailableqtycheck=parseInt(totalavailableqty)+parseInt($scope.old_total_available_qty);
 				var totalorderedqty=$scope.currentPending.total_ordered_qty;
 				console.log("totalavailableqty",totalavailableqty)
 				console.log("$scope.old_total_available_qty",$scope.old_total_available_qty);
 				console.log("totalavailableqtycheck",totalavailableqtycheck);
 				if (updateItemPending) {
               

            	console.log('Current Pending',$scope.currentPending._id);
            	if(totalorderedqty>=totalavailableqtycheck){

            	$scope.angubusy = $http.get('/api/pendingitemsku/'+$scope.currentPending._id).success(function(result) {
            			
	            			$scope.skuorderList=result;
            		
            	console.log("order list",$scope.skuorderList);
            	
            	var skuorderListlen=$scope.skuorderList.length;
            	
            	
            	for(var i=0;i<skuorderListlen;i++){
            	if(totalavailableqty==0){
            		continue;
            	}
            	var reqqty=$scope.skuorderList[i].ordered_qty-$scope.skuorderList[i].fullfilled_qty;
            	if(reqqty>totalavailableqty){

            		reqqty=totalavailableqty;
            		totalavailableqty=0;

            	}
            	else{
            		totalavailableqty=totalavailableqty-reqqty;


            	}
            	var suppInfo={'supplier_id':$scope.currentSupplier._id,'agreed_qty':reqqty};
   				
   				
          		                        	       	
            	$http.put('/api/pendinglistaddsupp/'+$scope.skuorderList[i]._id,suppInfo).success(function(result) {
            		
					
					
					if($scope.currentSupplier.weightage){
					$scope.currentSupplier.weightage=parseInt($scope.currentSupplier.weightage)+1;
					
				}
				else{
					$scope.currentSupplier.weightage="0";
					
				}

				$http.put('/api/supplierlist/'+$scope.currentSupplier._id,$scope.currentSupplier).success(function(result) {
					console.log("incremented the supplier weightage");
					that.getSkuDetails();
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
					
					
            	}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });
                }

			},function(err){
				$rootScope.apierror="Sorry!!! Error Occured";
			});
			
			
			$route.reload();
              }
              else{

              	alert("sorry!!!!totalavailableqty is greater than totalorderedqty");
             }
         }
              
		}



			$scope.IsHidden =false;
		 $scope.ShowItemTable = function () {
		 		$rootScope.apierror="";
		 		$scope.angubusy = $http.get('/api/pendingitemsku/'+$scope.currentPending._id).success(function(result) {
       			
       			$scope.skuorderList=result;
       			$scope.skuorderList.forEach(function(itemsupp){

       				$scope.suppInfoList=itemsupp.agreed_supplier;
       				console.log("suppInfoList",$scope.suppInfoList);
       			});
         	},function(err){
         		$rootScope.apierror="Sorry!!! Error Occured";
         	});
                $scope.IsHidden =true ;
            }


		 $scope.noStock=function(){
		 	$rootScope.apierror="";
		    	if($scope.currentSupplier.weightage=="0")
		    		$scope.currentSupplier.weightage="0";
		    	else
					$scope.currentSupplier.weightage=parseInt($scope.currentSupplier.weightage)-1;

		    	 var noStock = confirm('Are you absolutely sure?');  
 				if (noStock) {


				$http.put('/api/supplierlist/'+$scope.currentSupplier._id,$scope.currentSupplier).success(function(result) {
					console.log("Decremented the supplier weightage");
					
				
		    		
		    		
		    	if($scope.supplierIndex==$scope.supplierList.length || $scope.supplierList.length==0){
		    		if($scope.isMappingSuppliersLoaded)
		    			return;
		    		nextSuppliers($scope.supplierIndex);
		    		
		    	}
		    		else{

		    			isexemptedSupplier().then(function(result){

		    					var eObj={};
		    		eObj.sku=$scope.currentPending.sku;
		    		eObj.supplierid=$scope.currentSupplier.cust_id;
		    		$scope.exemptedsupp=eObj;
		    		console.log("$scope.exemptedsupp",$scope.exemptedsupp);
		    	
					$http.post('/api/exemptedsupp',$scope.exemptedsupp).success(function(results) {
					$scope.exemptedsupp=results;

					$scope.supplierIndex++;
				    $scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];

		    				},function(err){
		    					$rootScope.apierror="Sorry!!! Error Occured";
		    				});

		    			
	
		    	 }, function(err) {
				      $rootScope.apierror="Sorry!!! Error Occured";
				    });
		    	}
		    	 }, function(err) {
				     $rootScope.apierror="Sorry!!! Error Occured";
				    });
		    	
		    		

				}
		    		
			}

		    


		    function isexemptedSupplier(){
		    	$rootScope.apierror="";
		    	$scope.old_fullfilled_qty=$scope.currentPending.fullfilled_qty;
		    	var defer = $q.defer();
		    	
		    	$scope.angubusy = $http.get('/api/exemptedsupp/'+$scope.currentPending.sku).success(function(result){

		    			
		    			 defer.resolve(result)
		    			$scope.exemppSupp=result;
		    			console.log("isexemptedSupplier result",result);
		    		
		    			
		    	}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

                return defer.promise;

		    }

		     function isexemptedItemSupplier(){
		    	$rootScope.apierror="";
		    	$scope.old_total_available_qty=$scope.pendingItemDetails.total_available_qty;
		    	var defer = $q.defer();
		   
		    	$scope.angubusy = $http.get('/api/exemptedsupp/'+$scope.pendingItemDetails._id).success(function(result){

		    			
		    			 defer.resolve(result)
		    			$scope.exemppSupp=result;
		    			console.log("isexemptedSupplier result",result);
		    		
		    			
		    	}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

                return defer.promise;

		    }


		     $scope.noItemStock=function(){
		     	$rootScope.apierror="";
		     	console.log("currentPending",$scope.pendingItemDetails);
		    	if($scope.currentSupplier.weightage=="0")
		    		$scope.currentSupplier.weightage="0";
		    	else
					$scope.currentSupplier.weightage=parseInt($scope.currentSupplier.weightage)-1;

		    	 var noStock = confirm('Are you absolutely sure?');  
 				if (noStock) {


				$http.put('/api/supplierlist/'+$scope.currentSupplier._id,$scope.currentSupplier).success(function(result) {
					console.log("Decremented the supplier weightage");
					
				
		    		
		    		
		    	if($scope.supplierIndex==$scope.supplierList.length || $scope.supplierList.length==0 ){
		    		if($scope.isMappingSuppliersLoaded)
		    			return;
		    		nextSuppliers($scope.supplierIndex);
		    		
		    	}
		    		else{

		    			isexemptedItemSupplier().then(function(result){

		    					var eObj={};
		    		eObj.sku=$scope.pendingItemDetails._id;
		    		eObj.supplierid=$scope.currentSupplier.cust_id;
		    		$scope.exemptedsupp=eObj;
		    		console.log("$scope.exemptedsupp",$scope.exemptedsupp);
		    	
					$http.post('/api/exemptedsupp',$scope.exemptedsupp).success(function(results) {
					$scope.exemptedsupp=results;

					$scope.supplierIndex++;
				    $scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];

		    				},function(err){
		    					$rootScope.apierror="Sorry!!! Error Occured";
		    				});

		    			
	
		    	 }, function(err) {
				      $rootScope.apierror="Sorry!!! Error Occured";
				    });
		    	}
		    	 }, function(err) {
				      $rootScope.apierror="Sorry!!! Error Occured";
				    });
		    	
		    		

				}
		    		
			}



		

			$scope.deletePending = function(id) {
				$rootScope.apierror="";
				var that=this;
				
				var deletePending = confirm('Are you absolutely sure you want to delete?');  
 				if (deletePending) {
				$http.delete('/api/pendinglist/' + id).then(
						function(result) {
							that.getAllPendings();
						}, function(err) {
							$rootScope.apierror="Sorry!!! Error Occured";
						});
					}
			
			}

			 $scope.open = function () {
			 	$scope.pending={};
       			console.log("open pending called");
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addpending.html',
                  controller: 'pendingmodalController',                
                 
                  resolve: {
                      pending : function () {
                          return $scope.pending;
                      }
                  }
              });

             modalInstance.result.then(function (pending) {

             	

			      $scope.pending = pending;

			      $scope.addPending();
			    }, function () {
			      console.log("updated pending",$scope.pending);
			    });
			        
          }
 
      $scope.getOrderDetails=function(){
      
      	var selectedOrderId=PendingDetailsService.getData();
      	var orderid=selectedOrderId.order_id;
      	console.log("current supplier",$scope.currentSupplier);
      	$scope.currentSupplier=$scope.supplier;
      	
      	$scope.angubusy = $http.get('/api/pendingdetails/' + orderid).success(function(result) {
					
					
					$scope.pendingDetailsList = result;
					

					var count=$scope.pendingDetailsList.length;
			  		var finalList=[];
			  		
			  		
			  		var newObj={};

		  		$scope.pendingDetailsList.forEach(function(obj){
		  			console.log("foreach",obj);
		  		
		  			var pObj=obj;
		  			
		  				var omsstatus='DarkSlateBlue';


		  			if(parseInt(pObj.fullfilled_qty)==0){
		  				omsstatus='red';
		  			}
		  			else if(parseInt(pObj.ordered_qty)>parseInt(pObj.fullfilled_qty)){
		  				if(omsstatus!='red')
		  					omsstatus='yellow';
		  			}else if(parseInt(pObj.ordered_qty)==parseInt(pObj.fullfilled_qty)){
		  				if(omsstatus!='red' && omsstatus!='yellow')
		  					omsstatus='DarkSlateBlue';
		  			}
		  			
		  			
					pObj.omsstatus=omsstatus;
					finalList.push(pObj);

		  		});
		  		
		  		$scope.finalList=finalList;

      });
  }

   $scope.IsHidden = false;
   		
         $scope.ShowTable = function (pending) {
         	$rootScope.apierror="";
       		console.log("pending obj",pending);
         $scope.angubusy = $http.get('/api/pendingsuppdetails/'+pending._id).then(function(result){
         	
         	$scope.commSupplierList=result.data[0].agreed_supplier;

         },function(err){
		  		$rootScope.apierror="Sorry!!! Error Occured";
		  	});
                $scope.IsHidden =true ;
            }




   $scope.getSkuDetails=function(){

      	var pending=PendingItemDetailsService.getData();
      			var sku=pending._id;
      			
			$scope.pendingItemDetails=pending;	
			
			$scope.currentSupplier=$scope.supplier;
			
				
			this.supplierItemDetails(pending);

		}

		   




      		$scope.showDetails= function (orderid) {

		        if (orderid === undefined ) {
		            
		        }       
		        else {
		            
		            var selectedOrderId={'order_id' : orderid};

		            PendingDetailsService.addData(selectedOrderId);
		           $location.path('/pendingsdetails');
		        }
		    }

		    $scope.showItemDetails= function (pending) {         
		    		
		            PendingItemDetailsService.addData(pending);
		           $location.path('/pendingsitemdetails');
		       
		    }




		    $scope.supplierDetails=function(pending){
		    	$rootScope.apierror="";
		    	var that=this;
		    	

		    	if(!pending.fc)
		    		pending.fc='101';
		    		
					$scope.angubusy = $http.get('/api/fcsupplierlist/'+ pending.fc).success(function(result) {

		    		$scope.supplierList=result.suppliers;
		    		$scope.currentPending=pending;
					$scope.suppLocation=result.fc_location;
					isexemptedSupplier().then(function(result) {
		    		console.log("supplierDetails result",result);
		    		var expemtedSuppliers=result;
		    		var len=expemtedSuppliers.length;
		    		

		    		for(var i=0;i<len;i++){
		    			
		    			var curObj=expemtedSuppliers[i];	
		    			
		    			for(var j=0;j<$scope.supplierList.length;j++){
		    				
		    				
		    				
		    				var eObj=$scope.supplierList[j];
		    				
		    				if(eObj){

		    				if(curObj.supplierid==eObj.cust_id){
		    				
		    					$scope.supplierList.splice(j,1);
		    					break;

		    				}
		    				
		    			}
		    				
				
					}

		    		}

		    		
					$scope.supplierIndex=0;	
					if($scope.supplierList.length==0){
						that.nextSuppliers($scope.supplierIndex);
					}else{
					$scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];
				}
					


		    		
		    	 }, function(error) {
				      $rootScope.apierror="Sorry!!! Error Occured";
				    });


				
					
					$scope.isMappingSuppliersLoaded=false;

				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

		    }

		     $scope.supplierItemDetails=function(pending){
		     $rootScope.apierror="";
		    	var that=this;
		    	if(!pending.fc)
		    		pending.fc='101';
		    		
					$scope.angubusy = $http.get('/api/fcsupplierlist/'+ pending.fc).success(function(result) {
		    		

		    		$scope.supplierList=result.suppliers;
		    		$scope.currentPending=pending;
		    		
					isexemptedItemSupplier().then(function(result) {
		    		
		    		var expemtedSuppliers=result;
		    		var len=expemtedSuppliers.length;
		    		for(var i=0;i<len;i++){
		    			
		    			var curObj=expemtedSuppliers[i];	
		    			
		    			for(var j=0;j<$scope.supplierList.length;j++){
		    				
		    				
		    				
		    				var eObj=$scope.supplierList[j];
		    				
		    				if(eObj){

		    				if(curObj.supplierid==eObj.cust_id){
		    				
		    					$scope.supplierList.splice(j,1);
		    					break;

		    				}
		    				
		    			}
		    				
				
					}

		    		}

		    		
					$scope.supplierIndex=0;	
					if($scope.supplierList.length==0){
						that.nextItemSuppliers($scope.supplierIndex);
					}
					$scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];
					


		    		
		    	 }, function(error) {
				      $rootScope.apierror="Sorry!!! Error Occured";
				    });


				
					
					$scope.isMappingSuppliersLoaded=false;

				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

		    }


		    $scope.nextSuppliers=function(index){

		    	$rootScope.apierror="";
		    	$scope.angubusy = $http.get('/api/fcnextsupplierlist/'+ $scope.currentPending.fc).success(function(result) {
						console.log('Next supplier details',result);
						
					
					var resLen= result.length;
					for(var i=0;i<resLen;i++){
						var secFCObj= result[i].secondary_fc.suppliers;

						for(var j=0;j<secFCObj.length;j++){
							$scope.supplierList.push(secFCObj[j]);



						}
						

					}
					
					isexemptedSupplier().then(function(result) {
		    		console.log("supplierDetails result",result);
		    		var expemtedSuppliers=result;
		    		var len=expemtedSuppliers.length;
		    		
		    		
		    		for(var i=0;i<len;i++){
		    			
		    			var curObj=expemtedSuppliers[i];	
		    			
		    			for(var j=0;j<$scope.supplierList.length;j++){
		    				
		    				
		    				
		    				var eObj=$scope.supplierList[j];
		    				
		    				if(eObj){

		    				if(curObj.supplierid==eObj.cust_id){
		    				
		    					$scope.supplierList.splice(j,1);
		    					break;

		    				}
		    				
		    			}
		    				
				
					}

		    		}

		    		console.log("supplierlist length", $scope.supplierList.length);
					$scope.supplierIndex=0;	
					
					$scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];
					


		    		
		    	 }, function(error) {
				      $rootScope.apierror="Sorry!!! Error Occured";
				    });

				    $scope.isMappingSuppliersLoaded=true;
					
			}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

		    }

		    $scope.nextItemSuppliers=function(index){
		    	$rootScope.apierror="";
		    	
		    	$scope.angubusy = $http.get('/api/fcnextsupplierlist/'+ $scope.currentPending.fc).success(function(result) {
						console.log('Next supplier details',result);
						console.log("result[0]", result[0].secondary_fc.suppliers);
					
					var resLen= result.length;
					for(var i=0;i<resLen;i++){
						var secFCObj= result[i].secondary_fc.suppliers;

						for(var j=0;j<secFCObj.length;j++){
							$scope.supplierList.push(secFCObj[j]);
						}
					}

					isexemptedItemSupplier().then(function(result) {
		    		console.log("supplierDetails result",result,$scope.supplierList);
		    		var expemtedSuppliers=result;
		    		var len=expemtedSuppliers.length;
		    		for(var i=0;i<len;i++){
		    			
		    			var curObj=expemtedSuppliers[i];	
		    			
		    			for(var j=0;j<$scope.supplierList.length;j++){
		    				
		    				
		    				
		    				var eObj=$scope.supplierList[j];
		    				
		    				if(eObj){

		    				if(curObj.supplierid==eObj.cust_id){
		    				
		    					$scope.supplierList.splice(j,1);
		    					break;

		    				}
		    				
		    			}
		    				
				
					}

		}

		    		console.log("supplierlist length", $scope.supplierList.length);
					$scope.supplierIndex=0;	
					
					$scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];
					


		    		
		    	 }, function(error) {
				      $rootScope.apierror="Sorry!!! Error Occured";
				    });

				    $scope.isMappingSuppliersLoaded=true;
					
			}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
                });

		    }



		    $scope.prevSupplier=function(){

		    	$scope.supplierIndex--;
		    	$scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];

		    }

		     $scope.showCurrentStock=function(){
		     	

		     	
		    	$scope.supplierIndex--;
		    	$scope.currentSupplier=$scope.supplierList[$scope.supplierIndex];

		    }

		       $scope.agreedSupplier=function(){
		       	
		       	var elementid=$scope.currentPending._id;

		       	
		      	angular.element(document.getElementById(elementid))[0].disabled = false;

		       }



          	 $scope.currentStock = function () {

          	 	
          	 	var stockObj={'supplierid': $scope.currentSupplier._id,
          	 				   'stockid': $scope.currentPending.item_details._id
          	 				}

       			
          	 	PendingDetailsService.addStockData(stockObj);


             var modalInstance=$uibModal.open({
                  templateUrl: 'views/CurrentStockForSupplier.html',
                  controller:'SupplierController'              
                     
              });
         }



         $scope.currentItemStock = function () {
         	$rootScope.apierror="";
         	 
         	
         	$scope.angubusy = $http.get('/api/pendingitemsku/'+$scope.currentPending._id).success(function(result) {
            			$scope.skuorderList=result;
           		
            for(var i=0;i<$scope.skuorderList.length;i++){
          	 	

          	 	var stockObj={'supplierid': $scope.currentSupplier._id,
          	 				   'stockid': $scope.skuorderList[i].item_details._id
          	 				}

       			PendingDetailsService.addStockData(stockObj);
          	 	
          	 }

             var modalInstance=$uibModal.open({
                  templateUrl: 'views/CurrentStockForSupplier.html',
                  controller:'SupplierController'              
                     
              });

             },function(err){
             		$rootScope.apierror="Sorry!!! Error Occured";
            	});

         }


        
            $scope.HideTable = function () {
         	 
                $scope.IsHidden =false;
            }

          	 $scope.openedit = function (pending) {
       			
          	 	console.log("Edit pending",pending);
       			$scope.pending=pending;
             var modalInstance=$uibModal.open({
                  templateUrl: 'views/addpending.html',
                  controller: 'pendingmodalController',                
                 
                  resolve: {
                      pending: function () {
                          return $scope.pending;
                      }
                  }
              });
             

             modalInstance.result.then(function (pending) {

             	
             		
			      $scope.pending = pending;
			      $scope.updatePending(pending._id);

			      
			    }, function () {
			      console.log("updated pending",$scope.pending);
			    });
			        
          }

          $scope.pendingOrderSearch = function() {
          	$rootScope.apierror="";
          	console.log("getAllPendings for search");
          	
				$http.post('/api/ordersummarysearch/',{'searchText':$scope.pendingordersearch}).then(function(result) 
				{
					
					console.log("searched record :",result);
					var count=result.data.length;
					var finalList=[];
			  		var omsstatus='DarkSlateBlue';
			  		var originalstatus='green';
			  		var newObj={};
					for(var i=0;i<count;i++){
		  			var pObj=result.data[i];

		  			if(newObj.order_id && (pObj.order_id!=newObj.order_id)){
		  				finalList.push(newObj);
		  				newObj={};
		  				omsstatus='DarkSlateBlue';
		  				originalstatus='green';
		  			}

		  			if(parseInt(pObj.fullfilled_qty)==0){
		  				omsstatus='red';
		  			}
		  			else if(parseInt(pObj.ordered_qty)>parseInt(pObj.fullfilled_qty)){
		  				if(omsstatus!='red')
		  					omsstatus='yellow';
		  			}else if(parseInt(pObj.ordered_qty)==parseInt(pObj.fullfilled_qty)){
		  				if(omsstatus!='red' && omsstatus!='yellow')
		  					omsstatus='DarkSlateBlue';
		  			}

		  			if(parseInt(pObj.available_qty)==0){
		  				originalstatus='red';
		  			}
		  			else if(parseInt(pObj.ordered_qty)>parseInt(pObj.available_qty)){
		  				if(omsstatus!='red'){
		  					omsstatus='orange';
		  				}
		  			}else if(parseInt(pObj.ordered_qty)==parseInt(pObj.available_qty)){
		  				if(omsstatus!='red' && omsstatus!='orange')
		  					omsstatus='green';

		  			}
		  			
		  			newObj.order_id=pObj.order_id;
		  			newObj.omsstatus=omsstatus;
		  			newObj.originalstatus=originalstatus;
		  		}
		  		if(newObj.order_id){
		  			finalList.push(newObj);
		  		}
		  		$scope.currentPendings=finalList;

		  		$timeout(function()
					{
						$scope.$apply(function()
						{
							$scope.currentPage = 1;
							$scope.pendingsPerPage =25; 
		  					$scope.maxSize = 5; 
							$scope.currentPendings=$scope.currentPendings.slice(0,25);
		  					$scope.totalPendings = $scope.currentPendings.length;
		  					
						});
					
					},0);

					
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
  			
  
		}

				$scope.pendingItemSearch=function(){

					$rootScope.apierror="";
          	console.log("getAllPendings for search");
          	
				$http.post('/api/itemsummarysearch/',{'searchText':$scope.pendingitemsearch}).then(function(result) 
				{
					console.log("searched record",result);
					var pendinglist=result.data;
					
		  		var skuarr=[];
		  		pendinglist.forEach(function(skuObj){
		  			
				$scope.angubusy = $http.get('/api/pendingitemsearch/'+skuObj.sku).then(function(doc) {
				
				
				var pendingitemlist=doc.data;
				pendingitemlist.forEach(function(skuItemObj){
				$scope.angubusy = $http.get('/api/itemskusearch/'+skuItemObj._id).then(function(docs) {
						skuItemObj.item_name=docs.data.item_name;
						skuarr.push(skuItemObj);

						$scope.pendingitemsearchList=skuarr;
						$timeout(function()
						{
						$scope.$apply(function()
						{
							
							$scope.currentItemPage = 1;
							$scope.pendingItemsPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allPendingItems=$scope.pendingitemsearchList;
							$scope.currentPendingItems=$scope.allPendingItems.slice(0,25);
		  					$scope.totalPendingItems = $scope.allPendingItems.length;
		  					
						});
					
					},0);

						},function(err){
							$rootScope.apierror="Sorry!!! Error Occured";
						});

				
				});
					
				
					
					
					},function(err){
						$rootScope.apierror="Sorry!!! Error Occured";
					});
				});

				},function(err){
						$rootScope.apierror="Sorry!!! Error Occured";
					});

					
							
				}

	
				$scope.getPendingView= function() {
				$rootScope.apierror="";
		  		$scope.angubusy = $http.get('/api/pendinglist').then(function(result) 
		  		{
					console.log( "getPendingView",result);
					populatePendingOrdersList(result.data);

								
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
					
					$scope.angubusy = $http.get('/api/fclist').then(function(result) {
					
					$scope.fcList = result.data;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});
			}
		  function populatePendingOrdersList(pendingList){
		  	$scope.pendingList = pendingList;
					var count=$scope.pendingList.length;
			  		var finalList=[];
			  		var originalstatus='green';
			  		var omsstatus='DarkSlateBlue';
			  		var newObj={};

		  		for(var i=0;i<count;i++){
		  			

		  			var pObj=$scope.pendingList[i];

		  			if(newObj.order_id && (pObj.order_id!=newObj.order_id)){
		  				finalList.push(newObj);
		  				newObj={};
		  				omsstatus='DarkSlateBlue';
		  				originalstatus='green';
		  				
		  			}


		  			if(parseInt(pObj.fullfilled_qty)==0){
		  				omsstatus='red';
		  			}
		  			else if(parseInt(pObj.ordered_qty)>parseInt(pObj.fullfilled_qty)){
		  				if(omsstatus!='red'){
		  					omsstatus='yellow';
		  				}
		  			}else if(parseInt(pObj.ordered_qty)==parseInt(pObj.fullfilled_qty)){
		  				if(omsstatus!='red' && omsstatus!='yellow')
		  					omsstatus='DarkSlateBlue';

		  			}


		  			if(parseInt(pObj.available_qty)==0){
		  				originalstatus='red';
		  			}
		  			else if(parseInt(pObj.ordered_qty)>parseInt(pObj.available_qty)){
		  				if(omsstatus!='red'){
		  					omsstatus='orange';
		  				}
		  			}else if(parseInt(pObj.ordered_qty)==parseInt(pObj.available_qty)){
		  				if(omsstatus!='red' && omsstatus!='orange')
		  					omsstatus='green';

		  			}
		  			
		  			newObj.order_id=pObj.order_id;
		  			newObj.omsstatus=omsstatus;
		  			newObj.originalstatus=originalstatus;
		  			

		  		}
		  		if(newObj.order_id){
		  			finalList.push(newObj);
		  		}
		  		$scope.finalList=finalList;

		  		console.log("Final List",finalList);

		  		
					$timeout(function()
					{
						$scope.$apply(function()
						{
							$scope.currentPage = 1;
							$scope.pendingsPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allPendings=$scope.finalList;
							$scope.currentPendings=$scope.allPendings.slice(0,25);
		  					$scope.totalPendings = $scope.allPendings.length;
		  					
						});
					
					},0);
		  }

			  $scope.pageChanged = function() {
			  	
			  	if($scope.allPendings){
			  	var startIndex=($scope.currentPage-1)* $scope.pendingsPerPage;
			  	var endIndex=($scope.currentPage)* $scope.pendingsPerPage;
			   
			    
			    $scope.currentPendings=$scope.allPendings.slice(startIndex,endIndex);
			}
				
			    console.log('Page changed to: ' + $scope.currentPage);
			  }



		  $scope.getPendingItemView= function() {
		  	$rootScope.apierror="";
		  		var skuarr=[];
		  		
		  	$scope.angubusy = $http.get('/api/pendingitemlist').then(function(result) {
					console.log( "getPendingItemView",result);
					var pendinglist=result.data;
					
				pendinglist.forEach(function(skuObj){
					if(skuObj.total_available_qty!=skuObj.total_ordered_qty){
				$scope.angubusy = $http.get('/api/itemskusearch/'+skuObj._id).then(function(doc) {
						skuObj.item_name=doc.data.item_name;
						skuarr.push(skuObj);
						
						});
			}
					
				});
		  });

		  	$timeout(function(){
					$scope.pendingitemList=skuarr;
					$timeout(function()
					{
						$scope.$apply(function()
						{
							
							$scope.currentItemPage = 1;
							$scope.pendingItemsPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allPendingItems=$scope.pendingitemList;
							$scope.currentPendingItems=$scope.allPendingItems.slice(0,25);
		  					$scope.totalPendingItems = $scope.allPendingItems.length;
		  					
						});
					
					},0);
				

				},5000);
			

		  		$scope.angubusy = $http.get('/api/fclist').then(function(result) {
					
					$scope.fcList = result.data;
					
				}, function(err) {
					$rootScope.apierror="Sorry!!! Error Occured";
				});


		  }

		 

		  $scope.setPage = function (pageNo) {
		    		$scope.currentItemPage = pageNo;
		  }

			  $scope.itemPageChanged = function() {
			  	
			  	if($scope.allPendingItems){
			  	var startIndex=($scope.currentItemPage-1)* $scope.pendingItemsPerPage;
			  	var endIndex=($scope.currentItemPage)* $scope.pendingItemsPerPage;
			    console.log("startIndex  "+ startIndex);
			    console.log("endIndex  "+ endIndex);
			    
			    $scope.currentPendingItems=$scope.allPendingItems.slice(startIndex,endIndex);
			}
				
			    console.log('Page changed to: ' + $scope.currentItemPage);
			  }



			$scope.checkPrevSupplier = function() {
			 if ($scope.supplierIndex == 0) { 
			   return true;
			  }
			  else {
			   return false;
			  }
			};


			$scope.checkNextSupplier = function() {

			if($scope.supplierList){
			 if ($scope.supplierIndex == $scope.supplierList.length) { 
			   return true;
			  }
			  else {
			   return false;
			  }

			}
			return false;
			};

			$scope.addSupplierInfoObj=function(selectedObj){
				console.log('selected supplierInfo Object',selectedObj);
				$scope.currentSupplier=selectedObj.originalObject;
				
			}

			$scope.filterfc=function(){
				
				

				$scope.angubusy = $http.get('/api/pendinglist/'+$scope.filterbyfc).then(function(result){
					
					populatePendingOrdersList(result.data);

				});
			}


			$scope.filteritemfc=function(){
				
					var skuarr=[];
				$scope.angubusy = $http.get('/api/pendingitemlist/'+$scope.filterbyfc).then(function(result){
					
					

						var pendinglist=result.data;
					
				pendinglist.forEach(function(skuObj){
				$scope.angubusy = $http.get('/api/itemskusearch/'+skuObj._id).then(function(doc) {
						skuObj.item_name=doc.data.item_name;
						skuarr.push(skuObj);
						
						});
					
				});

				$timeout(function(){
					$scope.pendingitemList=skuarr;
					$timeout(function()
					{
						$scope.$apply(function()
						{
							console.log("pending items is",  skuarr);
							$scope.currentItemPage = 1;
							$scope.pendingItemsPerPage =25; 
		  					$scope.maxSize = 5; 
		  					$scope.allPendingItems=$scope.pendingitemList;
							$scope.currentPendingItems=$scope.allPendingItems.slice(0,25);
		  					$scope.totalPendingItems = $scope.allPendingItems.length;
		  					
						});
					
					},0);

				},5000)
				
			});
}


		
      }]);