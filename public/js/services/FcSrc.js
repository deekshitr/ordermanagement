angular.module('FcSrc',[]).factory('SupplierDetailsService', function() {
    var selectedfc = {};

    var addData = function(newObj) {
       
        selectedfc=newObj;
    }

    var getData = function(){
        return selectedfc;
    }

    return {
        addData: addData,
        getData: getData
    };
});

