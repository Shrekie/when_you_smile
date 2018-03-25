var app = angular.module('when_you_smile', ['ngRoute']);


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

app.controller('mainController', function($scope, 
	apiService, renderingComposition, videoCapture) {

	$scope.playBackCtrl = {recording:false};

	apiService.getUser().then((response)=>{
		$scope.user = response.data;
		console.log($scope.user);
	},(e)=>{
		console.log(e);
	})

	if(renderingComposition.checkCompatability()){

		renderingComposition.constructComposition();

		$scope.playDemo = renderingComposition.playDemo;

		$scope.saveVideo = function(){

			$scope.playBackCtrl.recording = true;

			videoCapture.saveVideo(renderingComposition.assetSources,function(){
				$scope.playBackCtrl.recording = false;
			});
			
		}

	}
});

app.controller('imagesController', function($scope, imageManager) {

	angular.element('#uploadImage').change(function(evt){
		imageManager.uploadImage($scope.currentImageID, evt);
	});

	angular.element('.imgpreview').click(function(){
		$scope.currentImageID = $(this).attr("id");
		angular.element('#uploadImage').trigger("click");
	})
	

});