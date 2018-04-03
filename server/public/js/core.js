var app = angular.module('when_you_smile', ['ngRoute']);


/*
	#TODO: Make clear cut compatibilty check.

	When user opens page, make sure user is 
	checked to be on latest Chrome and on a computer 
	for compability.
*/

//TODO: Remove API factory services from return function.

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', { 
		controller: 'mainController'
	})
	.when('/sendVideo', {
		controller:  'mainController'
	})
	.otherwise({ redirectTo: '/' });
});

app.controller('faceBookVideo', function($scope, $window,
	 faceBookApi, videoCapture, renderingComposition) {

	$scope.user = '';

	$scope.sendVideo = function(){

		$scope.playBackCtrl.recording = true;

		videoCapture.saveVideo(renderingComposition.assetSources, false, function(blobData){
			faceBookApi.sendVideo(blobData).then((response)=>{
				$window.open(response.data.shareLink);
			},(e)=>{
				console.log(e);
			})
			$scope.playBackCtrl.recording = false;
		});

	};
	

});

app.controller('mainController', function($scope, $window,
	renderingComposition, videoCapture) {

	$scope.playBackCtrl = {recording:false};

	if(renderingComposition.checkCompatability()){

		renderingComposition.constructComposition();

		$scope.playDemo = renderingComposition.playDemo;

		$scope.saveVideo = function(){

			$scope.playBackCtrl.recording = true;

			videoCapture.saveVideo(renderingComposition.assetSources, true, function(){
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

app.controller('imagesController', function($scope, imageManager) {

	angular.element('#uploadImage').change(function(evt){
		imageManager.uploadImage($scope.currentImageID, evt);
	});

	angular.element('.imgpreview').click(function(){
		$scope.currentImageID = $(this).attr("id");
		angular.element('#uploadImage').trigger("click");
	})
	

});