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

app.factory('seriouslyInterface', function() {
    return{
        doThing:() => {
			var seriously, // the main object that holds the entire composition
			picture, // a wrapper object for our source image
			video; // a wrapper object for our target canvas

			seriously = new Seriously();
			target = seriously.target('#canvas');

			// Create a source object by passing a CSS query string.
			video = seriously.source('#targetVideo');
			reformat = seriously.transform('reformat');
			reformat.width = target.width;
			reformat.height = target.height;
			reformat.mode = '#mode';
			reformat.source = '#targetPicture';
			image = reformat;
			// now do the same for the target canvas


			chroma = seriously.effect('chroma');
			blend = seriously.effect('blend');
			chroma.source = video;
			chroma.screen = [6 / 255, 255 / 255, 0 / 255, 1]

			blend.bottom = image;
			blend.top = chroma;

			blend.sizeMode = 'top';

			target.source = blend;

			seriously.go();

        }
    }
});

app.controller('mainController', function($scope, apiService, seriouslyInterface) {

	apiService.getUser().then((response)=>{
		$scope.user = response.data;
		console.log($scope.user);
	},(e)=>{
		console.log(e);
	})

	seriouslyInterface.doThing();

});