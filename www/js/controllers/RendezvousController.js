/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('RendezvousController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	// filter_motifs
    $scope.user = {};
    $scope.prestation = null;
    $scope.dateChoosed = false;
    $scope.prestations = [];
    self.prestations = [{
        id: 1, type: "rdv", time: 90, class: "lunettes", filter: false,
        name: "Vérification de la vue + lunettes"
    }, {
        id: 2, type: "rdv", time: 60, class: "lunettes", filter: false,
        name: "Lunettes"
    }, {
        id: 3, type: "rdv", time: 60, class: "alentilles", filter: false,
        name: "Adaptation lentilles"
    }, {
        id: 4, type: "rdv", time: 30, class: "lentilles", filter: false,
        name: "Lentilles"
    }, {
        id: 5, type: "rdv", time: 30, class: "reparations", filter: true,
        name: "Réparations"
    }, {
        id: 6, type: "rdv", time: 15, class: "ajustage", filter: true,
        name: "Ajustages"
    }, {
        id: 7, type: "ccl", time: 15, class: "clickcollect", filter: false,
        name: "Click & Collect",
        subtext: "Lentilles et produits"
    }];

    InitService.addEventListener('ready', function () {
        log('RendezvousController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.state = "motif";
        $scope.prestations = angular.copy(self.prestations);
        self.calendar = MyApp.fw7.app.calendar.create({
            inputEl: '#calendar-input'
        });
        $scope.opticien = localStorage.getItem("opticien");
        $scope.opticien = JSON.parse($scope.opticien);
        if (global.filter_motifs) {
            global.filter_motifs = false;
            $scope.prestations = [];
            for (let i = 0; i < self.prestations.length; i++) {
                if (self.prestations[i].filter == true)
                    $scope.prestations.push(self.prestations[i]);
            }
        }
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
            $scope.calendaritems = GetSlots($scope.calendaritems, $scope.prestation.time);
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

    self.bookslot = function(prestation, slot, callback) {
        // Split créneau bu removing the booked slot
        let timeSlot = angular.copy(slot.parent);
        let requestedSlot = angular.copy(slot);
        delete requestedSlot.parent;
        //debugger;
        //check is requested slot is in the timezone
        if ((timeSlot.start <= requestedSlot.start) && 
            (timeSlot.end >= requestedSlot.end)) {
            // 1. Le créneau est au début de la plage horaire
            if (timeSlot.start.getTime() === requestedSlot.start.getTime()) {
                if (timeSlot.end.getTime() === requestedSlot.end.getTime()) {
                    debugger;
                    // Slot is to be removed
                    self.DivideSlots(1, "delete_slot", timeSlot, callback);
                }
                else {
                    debugger;
                    // Update the slot by removing the begining
                    let new_start_date = addMinutes(timeSlot.start, prestation.time);
                    timeSlot.start = new_start_date;
                    timeSlot.start_view = self.getViewDate(new_start_date);
                    self.DivideSlots(2, "change_slot_start", timeSlot, callback);
                }
            }
            // 2. Le créneau se termine sur le fin de la plage horaire
            else if (timeSlot.end.getTime() === requestedSlot.end.getTime()) {
                debugger;
                // Update start of the time slot
                timeSlot.end = requestedSlot.start;
                timeSlot.end_view = self.getViewDate(timeSlot.end);
                self.DivideSlots(3, "change_slot_end", timeSlot, callback);
            }
            // 3. Le créneau est au milieu de la plage horaire
            else {
                // Split the slot
                let slot1 = {
                    start: timeSlot.start,
                    end: requestedSlot.start,
                    start_view: self.getViewDate(timeSlot.start),
                    end_view: self.getViewDate(requestedSlot.start)
                };
                let slot2 = {
                    start: requestedSlot.end,
                    end: timeSlot.end,
                    start_view: self.getViewDate(requestedSlot.end),
                    end_view: self.getViewDate(timeSlot.end)
                };
                debugger;
                self.DivideSlots(4, "make_two_slots", timeSlot, callback, slot1, slot2);
            }
        }
        else alert("There is an error with SLOTS !!! Contact Gilles !!!");
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

    self.getViewDate = function(date) {
        let hours = (date.getHours() < 10) ? ("0" + date.getHours()) : date.getHours();
        let minutes = (date.getMinutes() < 10) ? ("0" + date.getMinutes()) : date.getMinutes();
        return hours + ":" + minutes;
    };

    $scope.confirm = function() {
        console.log($scope.prestation);
        console.log($scope.opticien);
        console.log(global.user);
        //return;
        self.bookslot($scope.prestation, $scope.slot, function() {
            supe.from('Rendezvous').insert([{ 
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
        });
        
    };

    self.DivideSlots = function(step, step_description, timeSlot, callback, slot1, slot2) {
        switch(step) {
            case 1: console.log(step_description); // Detele slot
                supe.from('opt_creneau').delete().eq('id', timeSlot.id).then(function(e) {
                    //debugger;
                    if (typeof callback === 'function') callback();
                }).catch(function(e) { console.warn(e) });
                break;
            case 2: console.log(step_description);
                supe.from('opt_creneau').update({ "heure_debut": timeSlot.start_view }).eq('id', timeSlot.id).then(function(e) {
                    //debugger;
                    if (typeof callback === 'function') callback();
                }).catch(function(e) { console.warn(e) });
                break;
            case 3: console.log(step_description);
                supe.from('opt_creneau').update({ "heure_fin": timeSlot.end_view }).eq('id', timeSlot.id).then(function(e) {
                    //debugger;
                    if (typeof callback === 'function') callback();
                }).catch(function(e) { console.warn(e) });
                break;
            case 4: console.log(step_description);
                supe.from('opt_creneau').delete().eq('id', timeSlot.id).then(function(e) {
                    supe.from('opt_creneau').insert([
                        { "date": timeSlot.date_id, "heure_debut": slot1.start_view, "heure_fin": slot1.end_view },
                        { "date": timeSlot.date_id, "heure_debut": slot2.start_view, "heure_fin": slot2.end_view }
                    ]).then(function(e) {
                        //debugger;
                        if (typeof callback === 'function') callback();
                    }).catch(function(e) { console.warn(e) });
                }).catch(function(e) { console.warn(e) });
                break;
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