/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('AfterSaleController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];

    $scope.recu = "";
    $scope.note = "";
    $scope.zonecasse = null;
    $scope.zoneinconfort = "";
	
    InitService.addEventListener('ready', function () {
        log('AfterSaleController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.recu = "";
        setTimeout(function() {
            console.log("rdv : " + global.rdv_id);
        }, 150);
	};

    $scope.ShowInconfort = function() {
        $$(".zinconfort").show();
    };
    $scope.HideInconfort = function() {
        $$(".zinconfort").hide();
    };
    $scope.ClickArea = function(area) {
        $scope.zoneinconfort = area;
        self.sync();
        $scope.HideInconfort();
    };

    $scope.NoteAfterSale = function(note) {
        $scope.note = note;
        self.sync();
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