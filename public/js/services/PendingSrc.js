angular.module('PendingSrc',[]).factory('PendingDetailsService', function() {
    var myData = {};
    var currentstocksku={};

    var addData = function(newObj) {
       
        myData=newObj;
    }

    var getData = function(){
        return myData;
    }

    var addStockData = function(stockObj) {
       
        currentstocksku=stockObj;
    }

    var getStockData = function(){
        return currentstocksku;
    }


    return {
        addData: addData,
        getData: getData,
        addStockData:addStockData,
        getStockData:getStockData
    };
});
