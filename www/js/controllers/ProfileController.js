/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('ProfileController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
    $scope.user = {};

    InitService.addEventListener('ready', function () {
        log('OpticienController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        $scope.user = global.user;
        self.sync();
	};

    $scope.UpdateProfile = function() {
        let data = {
            "full_name": $scope.user.user_metadata.full_name,
            "telephone": $scope.user.user_metadata.telephone
        };
        supe.auth.update({
            "data": data
        }).then(function(response) {
            console.log(response);
            global.user = response.user;
            supe.from('users')
            .update(data)
            .eq('id', $scope.user.id)
            .then((response) => {
                MyApp.fw7.app.emit('ProfileUpdate', global.user);
                self.toast('Votre profil a été mis à jour');
            }).catch((error) => {
                console.warn(error);
            });
        }).catch((error) => {
            console.warn(error);
        });
    };

    $scope.UpdatePassword = function() {
        MyApp.fw7.app.dialog.password('Saisissez votre nouveau mot de passe', function (password) {
            supe.auth.update({
                "password": password
            }).then(function(response) {
                self.toast('Votre mot de passe a été mis à jour');
            }).catch((error) => {
                console.warn(error);
            });
        });
    };

    $scope.ForgotPassword = function() {
        supe.auth.api.resetPasswordForEmail(email).then(function(response) {
            self.toast('Vous recevrez un email pour réinitialiser votre mot de passe');
        }).catch((error) => {
            console.warn(error);
        });
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