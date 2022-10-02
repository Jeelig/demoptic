/*jslint browser: true*/
/*global console, MyApp*/

MyApp.angular.controller('HomeController', ['$scope', '$rootScope', 'InitService', function ($scope, $rootScope, InitService) {
    
	'use strict';
	
	var self = this;
	var rootEvents = [];
	
	$scope.searchView = "search";
	$scope.tabSeachActive = false;
	$scope.business = [];
    $scope.business_in_map = [];
	$scope.searchname = "";
	$scope.loading = false;
    $scope.fabOpened = false;
    $scope.existunreadnotif = false;
    $scope.notifications = [];

    $scope.email = "";
    $scope.password = "";
    $scope.user = null;
    $scope.rdv_tab = "coming";

    $scope.optics = [];

    InitService.addEventListener('ready', function () {
        log('HomePageController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        if (global.hasOwnProperty('active_tab')) {
            $scope.menu_item = global.active_tab;
        }
		else $scope.menu_item = 'home';
        if (!$scope.user && (global.user && (global.user != null))) {
            $scope.user = global.user;
            $$("#formulaire_login").hide();
            $$("#page_profile").show();
        }
	};

    //bandzagilles@yahoo.fr
    //thisisNot@tez!
    //gilles.bandza@gmail.com
    //Dochill8#=M
    $scope.Login = function() {
        let email = $scope.email;
        let passw = $scope.password;
        console.log(email + " / " + passw);
        MyApp.fw7.app.preloader.show();
        supe.auth.signIn({
            email: email,
            password: passw
        }).then((response) => {
            MyApp.fw7.app.preloader.hide();
            console.log(response);
            if (response.error) {
                alert(response.error.message);
            }
            else {
                $scope.user = response.user;
                global.user = response.user;
                self.sync();
                $$("#formulaire_login").hide();
                $$("#page_profile").show();
            }
        }).catch((error) => {
            MyApp.fw7.app.preloader.hide();
            console.log(error);
        });
    };

    $scope.register = function() {
        MyApp.fw7.app.dialog.preloader('Inscription ...');
        //return;
        supe.auth.signUp({
            email: $scope.reg_login,
            password: $scope.reg_password
        }, {
            data: { 
                full_name: $scope.reg_fullname
            }
        }).then((response) => {
            console.log(response);
            localStorage.setItem("email", $scope.reg_login);
            localStorage.setItem("password", $scope.reg_password);
            MyApp.fw7.app.dialog.close();
            MyApp.fw7.app.dialog.alert("Confirmez votre compte et connectez vous !", "Bravo", function() { 
                $$("#login_form").show();
                $$("#register_form").hide();
            });
            self.sync();
            //supabase_data_succeed(response, function() { });
        }).catch((error) => {
            console.warn(error);
        });
    };

    $scope.logout = function() {
        $scope.user = null;
        self.sync();
        MyApp.fw7.app.preloader.show();
        setTimeout(function() {
            $$("#formulaire_login").show();
            $$("#page_profile").hide();
            MyApp.fw7.app.preloader.hide();
        }, 500);
    };

    $scope.setTab = function(tab_name) {
        global.active_tab = tab_name;
        $scope.menu_item = tab_name;
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