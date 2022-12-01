/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('FavorisController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
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
        
        if (!global.user || !global.user.id) {
            MyApp.fw7.app.dialog.confirm('Veuillez vous connecter pour avoir accès à cette fonctionnalité', function () {
                mainView.router.back();
            }, function () {
                mainView.router.back();
            });
        }
        else {
        MyApp.fw7.app.dialog.preloader('');
            setTimeout(function() {
                supe.from('favoris')
                .select(
                    "id, Opticien(id, name, adresse, email, telephone, image, website, Ville, stars)"
                )
                .eq('user', global.user.id)
                .then((response) => {
                    MyApp.fw7.app.dialog.close();
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
                    MyApp.fw7.app.dialog.close();
                    console.warn(err)
                });
            }, 500);
        }
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