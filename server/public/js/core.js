var app = angular.module('nodeBoiler', ['ngRoute']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', { 
		controller: 'mainController'
	})
	.when('/app/me', {
		controller:  'mainController'
	})
	.otherwise({ redirectTo: '/' });
});

app.factory('apiService', function($http, $q) {
    return{
        getUser:() => {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/app/me'
            }).then(function (success) {
                deferred.resolve(success);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
});

app.controller('mainController', function($scope, apiService) {

	apiService.getUser().then((response)=>{
		$scope.user = response.data;
		console.log($scope.user);
	},(e)=>{
		console.log(e);
	})

});