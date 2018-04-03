app.factory('videoCapture', function($timeout, $interval) {

	return{
		saveVideo:(assetSources, openFile, done)=>{

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
				done(blob);
				if(openFile){
					var downloadLink = document.createElement("a");
					downloadLink.download = 'test.webm';
					downloadLink.style.display = 'none';
					downloadLink.href = url;
					console.log(url);
					document.body.appendChild(downloadLink);
					downloadLink.click();
				}
			}


			video.currentTime = 0;
			video.play();
			mediaRecorder.start(100); 

			//Todo: Handle the start and end recording better
			var renderTime = 0;

			var interval = $interval(function() {
				renderTime++;
				var percentage = 100*renderTime/24;
				$('.progress-bar').css('width', percentage + '%');
				$('.progress-bar').text(Math.floor(percentage) + '%');
			}, 1000, 24);

			$timeout(function(){ 
				mediaRecorder.stop();
				newStream.getTracks().forEach(track => track.stop());
				$('.progress-bar').css('width', 0 + '%');
				$('.progress-bar').text('0%');
				$interval.cancel(interval);
			}, 24000);

		}
	}
});