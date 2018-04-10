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
			return false;
		}	

		if (Seriously.incompatible('chroma')) {
			return false;
		}

		if (Seriously.incompatible('blend')) {
			return false;
		}

		if(!MediaRecorder){
			return false;
		}

		if (!MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
			return false;
		}

		var isChromium = window.chrome,
		winNav = window.navigator,
		vendorName = winNav.vendor,
		isOpera = winNav.userAgent.indexOf("OPR") > -1,
		isIEedge = winNav.userAgent.indexOf("Edge") > -1,
		isIOSChrome = winNav.userAgent.match("CriOS");

		if (isIOSChrome) {
			return false;
		} else if (
		isChromium !== null &&
		typeof isChromium !== "undefined" &&
		vendorName === "Google Inc." &&
		isOpera === false &&
		isIEedge === false
		) {
			return true;
		} else { 
			return false;
		}
			
	};

	constructComposition = function(){

		var picture,
		video;
		target = seriously.target('#canvasRenderStage');

		video = seriously.source('#targetVideo');
		reformat = seriously.transform('reformat');

		//reformat.source = '#targetPicture';

		reformat.width = target.width;
		reformat.height = target.height;
		reformat.mode = 'distort';
		image = reformat;

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