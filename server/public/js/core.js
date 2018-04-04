var app = angular.module('when_you_smile', ['ngRoute']);

/*
	#TODO: Make clear cut compatibilty check.

	When user opens page, make sure user is 
	checked to be on latest Chrome and on a computer 
	for compability.
*/

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
					$window.open(response.data.shareLink);
					$scope.playBackCtrl.processing = false;
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

	if(renderingComposition.checkCompatability()){

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

	}
	$("#canvasRenderStage").click(function(){
		console.log($scope.playBackCtrl.recording);
	});

});

app.controller('imagesController', function($scope, imageManager) {

	$scope.currentImageID = "";

	angular.element('#imageUploadInput').change(function(evt){
		console.log(imageManager.cImagePreview);
		imageManager.uploadImage(evt);
		$(this).val("");
		newFunction(evt);
	}); 

	angular.element('.imgpreview').click(function(evt){
		imageManager.cImagePreview = $(this);
		console.log(imageManager.cImagePreview);
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

