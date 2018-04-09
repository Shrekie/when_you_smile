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
		faceBookApi.authenticate(function(){
			$scope.playBackCtrl.recording = true;
			videoCapture.saveVideo(renderingComposition.assetSources, false, function(videoSaveResult){
				$scope.$apply(function(){
					$scope.playBackCtrl.recording = false;
				});
				if(!videoSaveResult.ruinedVideo){
					$scope.playBackCtrl.processing = true;
					faceBookApi.checkLogin().then((response)=>{
						faceBookApi.sendVideo(videoSaveResult.blob).then((response)=>{
							$scope.playBackCtrl.processing = false;
							if(response.data.e){
								alert('This app is under review, we cant publish to FaceBook.\n'+
								'Only test users can publish to Facebook.\n'+
								'Feel free do download the video using the save button.');
							}
							else if(!response.data.fileError){
								$window.open(response.data.shareLink);
								var shareLink = document.createElement("a");
								shareLink.href = response.data.shareLink;
								$(shareLink).html('<span class="okbutton glyphicon glyphicon-ok"></span>'+
								' Video uploaded to your profile, click here to share');
								shareLink.target = '_blank';
								$('#shareLinks').html(shareLink);
							}  
							else{
								console.log(response.data.fileError);
							}
						},(e)=>{
							console.log(e);
						})
					},(e)=>{
						console.log(e);
					});
				}
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

