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

app.controller('faceBookVideo', function($scope, $window,
	 faceBookApi, videoCapture, renderingComposition) {

	$scope.sendVideo = function(){

		$scope.playBackCtrl.recording = true;

		videoCapture.saveVideo(renderingComposition.assetSources, false, function(blobData){
			$scope.playBackCtrl.recording = false;
			// FIXME: Processing shows alert shows if FB login window closed.
			/*
				If user is not logged into facebook or not
				added application to their user the processing alert will show
				even if login window is closed.
			*/
			$scope.playBackCtrl.processing = true;
			faceBookApi.checkLogin().then((response)=>{
				faceBookApi.sendVideo(blobData).then((response)=>{
					$scope.playBackCtrl.processing = false;
					if(!response.data.fileError)
						$window.open(response.data.shareLink);
					else
						console.log(response.data.fileError);
						alert(response.data.fileError);
				},(e)=>{
					console.log(e);
				})
			},(e)=>{
				console.log(e);
			});
		});

	};
	

});

app.controller('mainController', function($scope, $window,
	renderingComposition, videoCapture) {

	$scope.playBackCtrl = {recording:false, processing:false};
	$scope.isBrowserCompatible = false;

	if(renderingComposition.checkCompatability()){
		$scope.isBrowserCompatible = true;

		renderingComposition.constructComposition();

		$scope.playDemo = renderingComposition.playDemo;

		$scope.saveVideo = function(){

			$scope.playBackCtrl.recording = true;

			videoCapture.saveVideo(renderingComposition.assetSources, true, function(){
				$scope.$apply(function(){
					$scope.playBackCtrl.recording = false;
				});
			});
			
		}

	}else{
		console.log('not on chrome');
	}

});

app.controller('imagesController', function($scope, imageManager) {

	$scope.currentImageID = "";

	angular.element('#imageUploadInput').change(function(evt){
		imageManager.uploadImage(evt);
		$(this).val("");
		newFunction(evt);
	}); 

	angular.element('.imgpreview').click(function(evt){
		imageManager.cImagePreview = $(this);
		$("#myModal").modal();
		evt.stopImmediatePropagation();
	})

	$scope.uploadImage = function(){

		angular.element('#imageUploadInput').trigger("click");
	};

	$scope.linkImage = function(){
		imageManager.linkImage($("#URLInput").val());
	};

});
function newFunction(evt) {
	evt.stopImmediatePropagation();
}

