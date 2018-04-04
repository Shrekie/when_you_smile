app.factory('renderingComposition', function() {

	var seriously // the main object that holds the entire composition
	seriously = new Seriously();
	seriously.assetSources = {};

	var checkCompatability = function(){

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
			
	};

	constructComposition = function(){

		var picture, // a wrapper object for our source image
		video; // a wrapper object for our target canvas
		target = seriously.target('#canvasRenderStage');

		// Create a source object by passing a CSS query string.
		video = seriously.source('#targetVideo');
		reformat = seriously.transform('reformat');

		//reformat.source = '#targetPicture';

		reformat.width = target.width;
		reformat.height = target.height;
		reformat.mode = 'distort';
		image = reformat;
		// now do the same for the target canvas

		//FIXME: Transparent images hide chromed overlay.
		chroma = seriously.effect('chroma');
		blend = seriously.effect('blend');

		chroma.source = video;
		chroma.screen = [6 / 255, 255 / 255, 0 / 255, 1];
		chroma.balance = 0;

		blend.bottom = image;
		blend.top = chroma;

		blend.sizeMode = 'bottom';

		target.source = blend;

		seriously.assetSources.video = video;
		seriously.assetSources.canvas = seriously.target('#canvasRenderStage');

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

	};

	var playDemo = function(){
		console.log("play");
		video = seriously.assetSources.video.original;
		video.currentTime = 0;
		video.play();
	};

    return{
		checkCompatability,
		constructComposition,
		playDemo,
		assetSources:seriously.assetSources
	}
	
});