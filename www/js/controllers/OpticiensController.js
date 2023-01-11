/*jslint browser: true*/
/*global console, MyApp*/

//const { $ } = require("dom7");

MyApp.angular.controller('OpticiensController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
    $scope.optics = [];
    $scope.page = 0;
    
    $scope.position = null;
    $scope.serviceurl = "https://api.axelib.io/0.1/specific/osf/opticiens.php";
    
	$scope.init = function() {
        $scope.page = 0;
        $scope.optics = [];
        self.sync();
        $$(".loadMore").removeClass("hidden");
        if (global.position) {
            self.setPositionActive();
            $scope.position = global.position;
        }
        if (global.user && global.user.id)
            self.getOpticiens();
        else {
            MyApp.fw7.app.dialog.confirm('Veuillez vous connecter pour avoir accès aux opticiens', function () {
                GoToPage("user");
                mainView.router.back();
            }, function () {
                mainView.router.back();
            });
        }
	};

    $scope.setDistance = function(d) {
        global.optic_distance = d;
    };

    self.getOpticiens = function(page) {
        $scope.page++;
        self.sync();
        setTimeout(function() {
            let url = $scope.serviceurl + "?page=" + $scope.page;
            if (global.position != null) {
                url += "&latitude=" + global.position.latitude + "&longitude=" + global.position.longitude;
            }
            MyApp.fw7.app.request.get(url).then((response) => {
                $$(".loading-results").addClass("hidden");
                if (response.error != null) console.warn(response.error.messages);
                else {
                    response.data = JSON.parse(response.data);
                    console.log(response.data);
                    if (response.data.length <= 0) {
                        $$(".loadMore").addClass("hidden");
                        $scope.page--;
                        self.sync();
                        return;
                    }
                    $scope.optics = $scope.optics.concat(response.data);
                    self.sync();
                }
            })
            .catch((err) => {
                $$(".loading-results").addClass("hidden");
                console.warn(err.response.text)
            });
        }, 500);
    };

    $scope.loadMore = function() {
        $$(".loading-results").removeClass("hidden");
        self.getOpticiens();
    };

    $scope.localize = function() {
        if (global.position != null) return;
        navigator.geolocation.getCurrentPosition(function(position) {
            global.position = position.coords;
            console.log(global.position);
            self.setPositionActive();
            $scope.init();
        }, self.ErrorLocation);
    };

    self.ErrorLocation = function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                self.toast("L'appareil n'autorise pas la demande de géolocalisation")
                break;
            case error.POSITION_UNAVAILABLE:
                self.toast("La géolocalisation n'est pas opérationnelle")
                break;
            case error.TIMEOUT:
                self.toast("La demande de géolocalisation a mis trop de temps")
                break;
            case error.UNKNOWN_ERROR:
                self.toast("Une erreur innatendue s'est produite.")
                break;
        }
    };

    self.setPositionActive = function() {
        $$(".page.opticiens .col.button.button-fill").css("color", "#FFF");
        $$(".page.opticiens .col.button.button-fill").css("background-color", "#3BB7B1");
    };

    self.toast = function(msg) {
        let toastBottom = MyApp.fw7.app.toast.create({
            text: msg,
            closeTimeout: 2000,
        });
        toastBottom.open();
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