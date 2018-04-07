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
				deferred.reject(error);
			}
		}, function (error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	var sendVideo = function(blobData){
		var deferred = $q.defer();
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
		return deferred.promise;
	};

	var authenticate = function(cb){

		var width = 800, height = 600;
		var w = window.outerWidth - width, h = window.outerHeight - height;
		var left = Math.round(window.screenX + (w / 2));
		var top = Math.round(window.screenY + (h / 2.5));

		var loginWindow = $window.open('/auth/facebook/callback', 'logIn', 'width='+width+',height='+height+',left='+left+',top='+top+
		',toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0');
		$window.addEventListener("message", function(event){
			if(event.data == "this window has loaded");
			loginWindow.close();
			cb();
		}, false);

	};

    return{
		sendVideo,
		checkLogin,
		authenticate
	}

});