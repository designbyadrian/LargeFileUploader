var LFU = angular.module('LargeFileUploader', ['ngFileUpload','ngRoute','ngSanitize','ngAnimate','angularMoment','angular-svg-round-progress']);

LFU.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);

	$routeProvider
		.when('/welcome',{
			templateUrl: 'templates/welcome.html'
		})
		.when('/form',{
			templateUrl: 'templates/form.html',
			controller: 'FormController'
		})
		.when('/upload',{
			templateUrl: 'templates/upload.html',
			controller: 'UploadController'
		})
		.when('/done',{
			templateUrl: 'templates/done.html'
		})
		.otherwise('/welcome');
}]);

LFU.controller('FormController', ['$scope','formFactory',function(scope,form) {
	scope.setData = form.setData;
}]);

LFU.factory('formFactory',function(){
	var fields = {},
		setData = function(key,value){
			fields[key] = value;
		};

	return {
		fields: fields,
		setData: setData
	};
});