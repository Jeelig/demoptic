/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('OpticienController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
    $scope.matieres = [{
        id: 0, name: "Titane", class: "cr_tita", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Resistantes et ultra légères, les montures en titane sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 1, name: "Acetate", class: "cr_acet", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Resistantes et ultra légères, les montures en acetate sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 2, name: "Plastique", class: "cr_plas", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Souples et ultra légères, les montures en plastique sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 3, name: "Métallique", class: "cr_meta", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Resistantes et ultra légères, les montures métallique sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 4, name: "Bois", class: "cr_bois", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Resistantes et ultra légères, les montures en bois sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 5, name: "Carbone", class: "cr_carb", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Resistantes et ultra légères, les montures en carbone sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 6, name: "Corne", class: "cr_corn", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Resistantes et ultra légères, les montures en corne sont élégantes et ne vous laisseront pas de marque sur le nez."
    }, {
        id: 7, name: "Recyclé", class: "cr_recy", marques: "Ray-Ban, Gucci, Prada, Izipizi ...", active: false,
        description: "Resistantes et ultra légères, les montures recyclés sont élégantes et ne vous laisseront pas de marque sur le nez."
    }];
	
	$scope.init = function() {
        $scope.id_matiere = -1;
        MyApp.fw7.app.on("opticien", function(e) {
            $scope.optic = e;
            localStorage.setItem("opticien", JSON.stringify(e));
            self.sync();
        });
	};

    $scope.changematiere = function(n) {
        $scope.id_matiere = n;
        console.log("ok");
        for (let i = 0; i < $scope.matieres.length; i++) {
            if ($scope.matieres[i].id == n) {
                $scope.matieres[i].active = true;
            }
            else {
                $scope.matieres[i].active = false;
            }
        }
        self.sync();
    };

    $scope.SetOpticien = function() {
        localStorage.setItem("opticien", JSON.stringify($scope.optic));
        if (global.user && global.user.id)
            mainView.router.navigate("/rdv/");
        else
            MyApp.fw7.app.dialog.alert('Veuillez vous connecter pour prendre rendez-vous');
    };

    $scope.setPayM = function(e) {
        $scope.iActive = e;
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