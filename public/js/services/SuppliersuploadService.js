angular.module('SuppliersuploadService',[]).directive('supplierfileChange',['$parse', function($parse){
  return{
    require:'ngModel',
    restrict:'A',
    link:function($scope,element,attrs,ngModel){
      var attrHandler=$parse(attrs['supplierfileChange']);
      var handler=function(e){
        $scope.$apply(function(){
          attrHandler($scope,{$event:e,files:e.target.files});
        });
      };
      element[0].addEventListener('change',handler,false);
    }
  }
}]);