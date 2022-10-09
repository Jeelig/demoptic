/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('OpticiensController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
    $scope.optics = [];

    InitService.addEventListener('ready', function () {
        log('OpticiensController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.optics = [];
        self.sync();
        setTimeout(function() {
            supe.from('Opticien')
                .select(`
                    id, created_at, name, image, adresse, Ville, CodePostal, stars
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
            });
        }, 500);
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