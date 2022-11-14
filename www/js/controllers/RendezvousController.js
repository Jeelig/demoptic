/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('RendezvousController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
    $scope.user = {};
    $scope.prestation = null;
    $scope.dateChoosed = false;
    $scope.prestations = [{
        id: 1, type: "rdv", time: 15, class: "lunettes",
        name: "Vérification de la vue + lunettes"
    }, {
        id: 2, type: "rdv", time: 15, class: "lunettes",
        name: "Lunettes"
    }, {
        id: 3, type: "rdv", time: 15, class: "alentilles",
        name: "Adaptation lentilles"
    }, {
        id: 4, type: "rdv", time: 15, class: "lentilles",
        name: "Lentilles"
    }, {
        id: 5, type: "rdv", time: 15, class: "reparations",
        name: "Réparations"
    }, {
        id: 6, type: "rdv", time: 15, class: "ajustage",
        name: "Ajustages"
    }, {
        id: 7, type: "ccl", time: 15, class: "clickcollect",
        name: "Click & Collect",
        subtext: "Lentilles et produits"
    }];

    InitService.addEventListener('ready', function () {
        log('RendezvousController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.state = "motif";
        self.calendar = MyApp.fw7.app.calendar.create({
            inputEl: '#calendar-input'
        });
        $scope.opticien = localStorage.getItem("opticien");
        $scope.opticien = JSON.parse($scope.opticien);
        self.getcalendar();
        self.sync();
	};

    self.getcalendar = function() {
        supe.from("opt_calendar").
        select("id, date, opticien, opt_creneau(id, heure_debut, heure_fin)").
        eq('opticien', $scope.opticien.id).
        then(function(e) {
            console.log(e);
            $scope.calendaritems = e.data;
            $scope.calendaritems = GetSlots($scope.calendaritems, 15);
            self.sync();
        }).
        catch(function(e) {
            console.warn(e);
        });
    };

    $scope.switchState = function(presta) {
        if (presta == 'recap') $scope.state = "recap";
        else if (presta.type == "rdv") {
            $scope.state = "cdate";
            $scope.prestation = presta ? presta : $scope.prestation;
        }
        else if (presta.type == "ccl") {
            mainView.router.navigate("/clickncollect/");
        }//$scope.state = "cdate";
        self.sync();
    };

    $scope.getDate = function(date, type) {
        return GetDateitem(new Date(date), type)
    };

    $scope.ShowSlots = function(item) {
        $scope.dateChoosed = false;
        for(let i = 0; i < $scope.calendaritems.length; i++) {
            if ($scope.calendaritems[i].id == item.id) {
                if (!item.showslots) item.showslots = true;
                else item.showslots = false;
            }
            else $scope.calendaritems[i].showslots = false;
        }
        self.sync();
    };

    $scope.ChooseSlot = function(cdi, slot) {
        for(let i = 0; i < cdi.slots.length; i++) {
            if (cdi.slots[i].id == slot.id) {
                slot.active = true;
                $scope.slot = slot;
                $scope.dateChoosed = true;
                setTimeout(function() {
                    $scope.switchState('recap');
                }, 150);
            }
            else cdi.slots[i].active = false;
        }
        self.sync();
    };

    $scope.confirm = function() {
        console.log($scope.prestation);
        console.log($scope.opticien);
        console.log(global.user);
        //return;
        supe.from('Rendezvous')
        .insert([{ 
            date: ((new Date($scope.slot.start)).toISOString()).toLocaleString('fr-FR'), 
            time: $scope.slot.view + ':00', 
            opticien: $scope.opticien.id, 
            utilisateur: global.user.id, 
            motif: $scope.prestation.name, 
            informations: 'otherValue information'
        }])
        .then(function(e) {
            console.log(e);
            MyApp.fw7.app.dialog.alert('Votre rendez-vous a été créé !', "Merci", function() {
                mainView.router.navigate("/");
            });
        })
        .catch(function(e) {
            console.warn(e);
        })
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