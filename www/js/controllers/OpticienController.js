/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('OpticienController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
    $scope.optics = [];

    InitService.addEventListener('ready', function () {
        log('OpticienController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.optics = [];
        self.sync();
        debugger;
        console.log(MyApp.fw7.app.router.currentRoute.params);
        /*
        supe.from('Opticien')
            .select(`
                id, created_at, name, image, adresse
            `)
        .then((response) => {
            console.log(response);
            if (response.error != null) {
                console.warn(response.error.messages);
            }
            else {
                $scope.optics = response.data;
                self.sync();
            }
        })
        .catch((err) => {
            console.warn(err.response.text)
        });*/
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