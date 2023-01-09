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
        $scope.optics = [];
        self.sync();
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

    self.getOpticiens = function(page) {
        $scope.page++;
        self.sync();
        setTimeout(function() {
            let url = $scope.serviceurl + "?page=" + $scope.page;
            if (global.position != null) {
                url += "&latitude=" + global.position.latitude + "&longitude=" + global.position.longitude;
            }
            MyApp.fw7.app.request.get(url).then((response) => {
                if (response.error != null) console.warn(response.error.messages);
                else {
                    response.data = JSON.parse(response.data);
                    console.log(response.data);
                    if (response.data.length <= 0) {
                        $$(".loadMore").hide();
                        $scope.page--;
                        self.sync();
                        return;
                    }
                    $scope.optics = $scope.optics.concat(response.data);
                    self.sync();
                }
            })
            .catch((err) => {
                console.warn(err.response.text)
            });
        }, 500);
    };

    $scope.loadMore = function() {
        self.getOpticiens();
    };

    $scope.localize = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            global.position = position.coords;
            console.log(global.position);
            self.setPositionActive();
        });
    };

    self.setPositionActive = function() {
        $$(".page.opticiens .col.button.button-fill").css("color", "#FFF");
        $$(".page.opticiens .col.button.button-fill").css("background-color", "#3BB7B1");
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