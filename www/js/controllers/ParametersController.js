/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('ParametersController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
    $scope.user = {};
    $scope.zoomed = false;
    $scope.essayages = [];

    InitService.addEventListener('ready', function () {
        log('ParametersController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.pref = user_preferences;
        MyApp.fw7.app.on("parameter", function(e) {
            $$("#block-" + e).show();
        });
	};

    $scope.request = function() {
        MyApp.fw7.app.preloader.show();
        setTimeout(function() {
            MyApp.fw7.app.preloader.hide();
            MyApp.fw7.app.dialog.confirm('Vous recevrez un rapport contenant vos données par email dans les 24 heures', function () {
                console.log("ok")
            });
        }, 1000);
    };

    $scope.isLoggedIn = function() {
        let loggedIn = false;
        if (global.user && global.user.id) loggedIn = true;
        return loggedIn;
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