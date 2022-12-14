/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('ParametersController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
    $scope.user = {};
    $scope.block = 0;
    $scope.zoomed = false;
    $scope.essayages = [];

    InitService.addEventListener('ready', function () {
        log('ParametersController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        console.log("ok");
        MyApp.fw7.app.on("parameter", function(e) {
            //debugger;
            console.log("ok");
            $scope.block = parseInt(e);
            self.sync();
        });
	};

    self.sync = function () { 
        if (!$scope.$$phase) { 
            $scope.$digest();
            if (self.applying) return;
            self.applying = true;
            $scope.$apply(function() {
                self.applying = false;
            });
        } 
    };
	
}]);