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

app.factory('videoCapture', function($timeout) {

	return{
		saveVideo:(assetSources, done)=>{

			var canvas = assetSources.canvas.original;
			var video = assetSources.video.original;
			var canvasStream = canvas.captureStream(30);
			var inputStream = video.captureStream(30);

			var options = {mimeType: 'video/webm'};
			var recordedBlobs = [];
			var newStream = new MediaStream();
			newStream.addTrack(inputStream.getAudioTracks()[0]);
			newStream.addTrack(canvasStream.getVideoTracks()[0]);
			mediaRecorder = new MediaRecorder(newStream, options);
			mediaRecorder.ondataavailable = function (event) {
				if (event.data && event.data.size > 0) {
					recordedBlobs.push(event.data);
				}
			}

			mediaRecorder.onstop = function (event){
				console.log("It stopped yo.")
				var blob = new Blob(recordedBlobs, {type: 'video/webm'});
				var url = window.URL.createObjectURL(blob);
				var a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				a.download = 'test.webm';
				document.body.appendChild(a);
				a.click();
			}


			video.currentTime = 0;
			video.play();
			mediaRecorder.start(100); 

			//Todo: Handle the start and end recording better
			$timeout(function(){ 
				mediaRecorder.stop();
				newStream.getTracks().forEach(track => track.stop());
				done();
			}, 24000);

		}
	}
});

app.factory('seriouslyInterface', function() {

	var seriously // the main object that holds the entire composition
	seriously = new Seriously();
	seriously.assetSources = {};

    return{
		checkCompatability:()=>{

			var msg = '', status = seriously.incompatible();

			if (status) {

			if (status === 'canvas') {
				msg = 'Your browser does not support HTML Canvas. Please consider upgrading.';
			} else if (status === 'webgl') {
				msg = 'Your browser does not support WebGL. Please try Firefox or Chrome.';
			} if (status === 'context') {
				msg = 'Your graphics hardware does not support WebGL. You may need to upgrade your drivers.';
			} else {
				msg = 'Unable to display content.'; //unknown error
			}
				alert(msg);
				return false;
			} else {
				return true;
			}
				
		},
        constructComposition:() => {

			var picture, // a wrapper object for our source image
			video; // a wrapper object for our target canvas
			target = seriously.target('#canvas');

			// Create a source object by passing a CSS query string.
			video = seriously.source('#targetVideo');
			reformat = seriously.transform('reformat');
			reformat.source = '#targetPicture';
			reformat.width = target.width;
			reformat.height = target.height;
			reformat.mode = 'distort';
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

			seriously.assetSources.video = video;
			seriously.assetSources.canvas = seriously.target('#canvas');

			seriously.go(function(now){
				//console.log(video.original.currentTime);
				if(video.original.currentTime > 0 && video.original.currentTime < 9.4){
					image.source = '#targetPicture';
				}
				if(video.original.currentTime > 9.4 && video.original.currentTime < 16.8){
					image.source = '#targetPicture2';
				}
				if(video.original.currentTime > 17){
					image.source = '#targetPicture3';
				}
			});

		},
		playDemo:()=>{
			console.log("play");
			video = seriously.assetSources.video.original;
			video.currentTime = 0;
			video.play();
		},
		assetSources:seriously.assetSources
    }
});

app.controller('mainController', function($scope, 
	apiService, seriouslyInterface, videoCapture) {

	$scope.playBackCtrl = {recording:false};

	apiService.getUser().then((response)=>{
		$scope.user = response.data;
		console.log($scope.user);
	},(e)=>{
		console.log(e);
	})

	if(seriouslyInterface.checkCompatability()){

		seriouslyInterface.constructComposition();

		$scope.playDemo = seriouslyInterface.playDemo;

		$scope.saveVideo = function(){

			$scope.playBackCtrl.recording = true;

			videoCapture.saveVideo(seriouslyInterface.assetSources,function(){
				$scope.playBackCtrl.recording = false;
			});
			
		}

	}
});