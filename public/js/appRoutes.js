angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/login.html'
		})
		
		.when('/users', {
			templateUrl: 'views/users.html',
			controller: 'UserController'

		})

		.when('/pendings', {
			templateUrl: 'views/pendings.html',
			controller: 'PendingController'
		})

		.when('/fcmappings', {
			templateUrl: 'views/fcmappings.html',
			controller: 'FcMappingController'
		})

		.when('/pendingsdetails', {
			templateUrl: 'views/pendingDetails.html',
			controller: 'PendingController'
		})

		.when('/suppliersdetails', {
			templateUrl: 'views/supplierDetails.html',
			controller: 'FcController'
		})

		
		.when('/stocks', {
			templateUrl: 'views/stocks.html',
			controller: 'StockController'	
		})

		.when('/suppliers', {
			templateUrl: 'views/suppliers.html',
			controller: 'SupplierController'
		})

		.when('/items', {
			templateUrl: 'views/items.html',
			controller: 'ItemController'
		})


		.when('/roles', {
			templateUrl: 'views/roles.html',
			controller: 'RoleController'
		})

		.when('/views', {
			templateUrl: 'views/views.html',
			controller: 'ViewController'
		})

		.when('/fcs', {
			templateUrl: 'views/fcs.html',
			controller: 'FcController'
		})

		.when('/pendingSummary', {
			templateUrl: 'views/pendingSummary.html',
			controller: 'PendingController'
		})

		.when('/itemSummary', {
			templateUrl: 'views/itemSummary.html',
			controller: 'PendingController'
		})

		.when('/pendingsitemdetails', {
			templateUrl: 'views/pendingItemDetails.html',
			controller: 'PendingController'
		})


     .otherwise({ redirectTo: '/' });

	$locationProvider.html5Mode(true);

}]);