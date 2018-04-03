var app = angular.module('when_you_smile', ['ngRoute']);


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



app.factory('faceBookApi', function($http, $q, $window) {

	var checkLogin = function(){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: '/checkLogin'
		}).then(function (success) {
			if (success.data.logged){
				deferred.resolve(success);
			}
			else{

				var width = 800, height = 600;
				var w = window.outerWidth - width, h = window.outerHeight - height;
				var left = Math.round(window.screenX + (w / 2));
				var top = Math.round(window.screenY + (h / 2.5));

				var loginWindow = $window.open('/auth/facebook/callback', 'logIn', 'width='+width+',height='+height+',left='+left+',top='+top+
				',toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0');
				
				$window.addEventListener("message", function(event){
					if(event.data == "this window has loaded");
					deferred.resolve(success);
					loginWindow.close();
				}, false);

			}
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

    return{
		sendVideo:(blobData) => {
			var deferred = $q.defer();
			checkLogin().then((response)=>{
				var fd = new FormData();
				fd.append('file', blobData);
				console.log(blobData);
				console.log(fd);
				$http.post('/sendVideo', fd,{
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				}).then(function (success) {
					deferred.resolve(success);
				}, function (error) {
					deferred.reject(error);
				});
			},(e)=>{
				deferred.reject(e);
			})
            return deferred.promise;
		}
	}

});

app.controller('faceBookVideo', function($scope, faceBookApi, videoCapture, renderingComposition) {

	$scope.user = '';

	$scope.sendVideo = function(){

		$scope.playBackCtrl.recording = true;

		videoCapture.saveVideo(renderingComposition.assetSources, false, function(blobData){
			faceBookApi.sendVideo(blobData).then((response)=>{
				console.log(response);
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