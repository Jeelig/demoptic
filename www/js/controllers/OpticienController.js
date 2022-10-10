/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('OpticienController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
    $scope.matieres = [{
        id: 0, name: "Titane", class: "cr_tita",
        description: "Resistantes et ultra légères, les montures en titane sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 1, name: "Acetate", class: "cr_acet",
        description: "Resistantes et ultra légères, les montures en acetate sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 2, name: "Plastique", class: "cr_plas",
        description: "Souples et ultra légères, les montures en plastique sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 3, name: "Métallique", class: "cr_meta",
        description: "Resistantes et ultra légères, les montures métallique sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 4, name: "Bois", class: "cr_bois",
        description: "Resistantes et ultra légères, les montures en bois sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 5, name: "Carbone", class: "cr_carb",
        description: "Resistantes et ultra légères, les montures en carbone sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 6, name: "Corne", class: "cr_corn",
        description: "Resistantes et ultra légères, les montures en corne sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 7, name: "Recyclé", class: "cr_recy",
        description: "Resistantes et ultra légères, les montures recyclés sont élégantes et ne vous laisseront pas de marque sur le nez."
    }];
	
	$scope.init = function() {
        $scope.id_matiere = -1;
        MyApp.fw7.app.on("opticien", function(e) {
            $scope.optic = e;
            self.sync();
        });
	};

    $scope.changematiere = function(n) {
        $scope.id_matiere = n;
        console.log("ok");
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