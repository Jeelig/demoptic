/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('AfterSaleController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];

    $scope.rdv = {};
    $scope.recu = "";
    $scope.note = "";
    $scope.disabled = false;
    $scope.zonecasse = null;
    $scope.image_casse = "";
    $scope.zoneinconfort = "";
	
    InitService.addEventListener('ready', function () {
        log('AfterSaleController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.recu = "";
        self.toastSuccess = MyApp.fw7.app.toast.create({
            text: "Informations transmises", position: 'center', closeTimeout: 2000,
        });
        setTimeout(function() {
            $scope.id = global.rdv_id;
            console.log("rdv : " + global.rdv_id);
            self.getRdv($scope.id);
            self.sync();
        }, 150);
	};

    self.getRdv = function(id) {
        //godown
        supe.from('Rendezvous')
        .select('id, date, time, utilisateur, note, opticien(id, name, image), motif, informations')
        .eq('id', id)
        .then((response) => {
            if (!response.error) {
                $scope.rdv = response.data[0];
                self.sync();
            }
            else console.warn(response);
        }).catch((error) => {
            console.warn(error);
        });
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

    $scope.vote = function(n) {
        let data = {}, openRdv = false;
        switch(n) {
            case 1: data = {received: false, callback: true, remark: "Le client n'a toujours pas reçu ses lunettes. Il souhaite être recontacté !" };
                break;
            case 2: data = {received: false, callback: false, remark: "Le client n'a toujours pas reçu ses lunettes. Ne souhaite pas être recontacté pour l'instant" };
                break;
            case 3: data = {received: false, note: $scope.note, callback: true, OriginProblem: $scope.origin, remark: "Le client a reçu ses lunettes. Il est satisfait !", comment: $scope.comment };
                break;
            case 4: data = {received: false, note: $scope.note, callback: true, OriginProblem: $scope.origin, remark: "Le client a reçu ses lunettes. Cependant il rencontre un problème d'esthétique" };
                openRdv = true;
                break;
            case 5: data = {received: false, note: $scope.note, callback: true, OriginProblem: $scope.origin, ZoneDetail: $scope.zoneinconfort, remark: "Le client a reçu ses lunettes. Cependant il rencontre un problème d'inconfort" };
                openRdv = true;
                break;
            case 6: data = {received: false, note: $scope.note, callback: true, OriginProblem: $scope.origin, ZoneDetail: $scope.zonecasse, imagecasse: $scope.image_casse, remark: "Le client a reçu ses lunettes. Cependant il rencontre un problème de casse" };
                break;
        }
        supe.from('Rendezvous')
        .update(data)
        .eq('id', $scope.id)
        .then(function(response) {
            if (!response.error) {
                $scope.disabled = true;
                self.sync();
                self.toastSuccess.open(); // Open it
                if (data.note) MyApp.fw7.app.emit("RdvTermine", $scope.id, data.note);
                if (openRdv) {
                    global.filter_motifs = true;
                    localStorage.setItem("opticien", JSON.stringify($scope.rdv.opticien));
                    if (global.user && global.user.id) {
                        $scope.disabled = false;
                        self.sync();
                        mainView.router.navigate("/rdv/");
                    }
                }
            }
            else {
                console.warn(response);
            }
        }).catch((err) => {
            elem.removeEventListener("change", self.onimage , false);
            self.errorhappened();
        });
    };
    
    $scope.getfile = function() {
        var elem = document.getElementById("file");
        elem.addEventListener("change", self.onimage , false);
        elem.click();
    };

    self.onimage = function() {
        var elem = document.getElementById("file");
        var file = elem.files[0];
        let ext = file.name.split(".")[file.name.split(".").length - 1];
        let now = (new Date()).getTime();
        let filename = "casse_" + global.user.id + "_" + now + "." + ext;
        supe.storage.from("casse").upload(filename, file)
        .then((response) => {
            elem.removeEventListener("change", self.onimage , false);
            if (!response.error) {
                let url = supe.storageUrl + "/object/public/casse/" + response.data.path;
                console.log(url);
                $scope.image_casse = url;
                self.sync();
            }
            else {
                console.warn(response);
            }
        }).catch((err) => {
            elem.removeEventListener("change", self.onimage , false);
            self.errorhappened();
        });
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