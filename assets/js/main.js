var LFU = angular.module('LargeFileUploader', ['ngFileUpload','ngRoute','ngSanitize','ngAnimate','angularMoment','angular-svg-round-progress']);

LFU.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/welcome',{
			templateUrl: 'templates/welcome.html'
		})
		.when('/form',{
			templateUrl: 'templates/form.html'
		})
		.when('/test',{
			templateUrl: 'templates/test.html',
			controller: 'UploadController'
		})
		.when('/upload',{
			templateUrl: 'templates/upload.html'
		})
		.when('/done',{
			templateUrl: 'templates/done.html'
		})
		.otherwise('/test');
}]);