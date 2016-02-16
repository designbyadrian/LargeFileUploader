LFU.controller('UploadController', ['$scope','Upload','moment','$timeout','$interval','$location',function(scope,Upload,moment,$timeout,$interval,$location) {

	scope.time = {
		elapsed: 0,
		remaining: 0,
		start: 0
	};

	scope.data = {
		speed: 0,
		speedAdjusted: 0,
		speedUnit: 'B/s',
		progress: 0,
		loaded: 0,
		total: 0,
		last: 0,
		ticks: [0,0,0],
	};

	scope.formatBytes = function(bytes){
		if(bytes < 1024) {
			scope.data.speedAdjusted = bytes;
			scope.data.speedUnit = "B/s";
		}
		else if(bytes < 1048576) {
			scope.data.speedAdjusted = (bytes / 1024).toFixed(1);
			scope.data.speedUnit = "KB/s";
		}
		else if(bytes < 1073741824) {
			scope.data.speedAdjusted = (bytes / 1048576).toFixed(1);
			scope.data.speedUnit = "MB/s";
		}
		else {
			scope.data.speedAdjusted = (bytes / 1073741824).toFixed(1);
			scope.data.speedUnit = "GB/s";
		}
	};

	scope.updateTime = function(){
		
		/* Speed ----- */

		var loaded = scope.data.loaded;

		scope.data.ticks.shift();
		scope.data.ticks.push(loaded-scope.data.last);

		scope.data.speed = scope.data.ticks.reduce(function(a,b){return a+b}) / 3;
		scope.formatBytes(scope.data.speed);

		scope.data.last = loaded;

		/* Elapsed -----  */

		scope.time.elapsed = +new Date() - scope.time.start;

		/* Remaining -----  */

		scope.time.remaining = ((scope.data.total-scope.data.loaded) / (scope.data.speed>0?scope.data.speed:0.000000000001))*1000;
	};

	scope.uploadFiles = function(file,errFiles){
		console.log("upload file",arguments);

		var calcProgress = function(){
			scope.data.progress = Math.round((scope.data.loaded/scope.data.total)*100);
		};

		if(file) {

			file.upload = Upload.upload({
				url: 'api/upload.php',
				method: 'POST',
				file: file,
				sendFieldAs: 'form',
				fields: {
					filename: moment().format("YYMMDD_HH-mm-ss-SSS"),
					filesize: file.size,
					name: 'Monkey'
				},
				resumeChunkSize: '10MB',
				resumeSizeUrl: 'api/upload.php?getname='+file.name
			});

			scope.uploading = true;
			scope.time.start = +new Date();

			scope.interval = $interval(function(){
				scope.updateTime();
			},1000);

			scope.loaderInterval = $interval(function(){
				calcProgress();
			},200);

			file.upload.then(function (response) {
				console.log("file uploaded",response);
				$timeout(function () {
					file.result = response.data;
					$interval.cancel(scope.interval);
					$interval.cancel(scope.loaderInterval);
					calcProgress();
					scope.uploading = false;
					scope.done = true;

					$timeout(function(){
						$location.url(scope.gotoWhenDone);
					},2000);

				});
			}, function (response) {
				console.error(response);
				if (response.status > 0) {
					scope.errorMsg = response.status + ': ' + response.data;
				}
			}, function (evt) {
				scope.data.loaded = evt.loaded;
				scope.data.total = evt.total;
			});
		}

	};

}]);

LFU.directive('uploadButton',function(){
	return {
		restrict: 'E',
		templateUrl: "templates/partial.upload.html",
		link: function(scope,$element,attr){

			scope.uploadBtn = {
				label: attr.label,
				doneLabel: attr.doneLabel
			};

			scope.gotoWhenDone = attr.gotoWhenDone;
		}
	};
});