/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('OpticienController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
	$scope.init = function() {
        MyApp.fw7.app.on("opticien", function(e) {
            $scope.optic = e;
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