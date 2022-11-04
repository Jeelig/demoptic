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
    $scope.top_article = null;
    
    $scope.optics = [];
    $scope.trends = [];

    InitService.addEventListener('ready', function () {
        log('HomePageController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        let session = localStorage.getItem("session");
        let credentials = localStorage.getItem("credentials");
        let firstlaunch = localStorage.getItem("firstlaunch");
        if (session) {
            session = JSON.parse(session);
            let expires_at = new Date(session.session.expires_at * 1000);
            if (expires_at > new Date()) {
                global.user = session.user;
            }
        }
        $scope.current = {
            image: "assets/img/trends/geometric.png"
        };
    
        if (credentials) {
            credentials = JSON.parse(credentials);
            $scope.email = credentials.email;
            $scope.password = credentials.password;
            self.sync();
            setTimeout(function() {
                $("#login_form ul li").addClass("item-input-focused");
            }, 500);
        }
        if (!firstlaunch) localStorage.setItem("firstlaunch", true);
        else {
            setTimeout(function() {
                let el = document.querySelector('.OpticFirstLaunch');
                if (el) el.remove();
            }, 50);
        }
        //else localStorage.setItem("firstlaunch", true);
        $scope.trend_menu = "discover";
        self.sync();
        if (global.hasOwnProperty('active_tab')) {
            $scope.menu_item = global.active_tab;
            if ($scope.menu_item) {
                $scope.rdvs = [];
                self.getRdv();
            }
        }
		else $scope.menu_item = 'home';
        if (!$scope.user && (global.user && (global.user != null))) {
            $scope.user = global.user;
            $$("#formulaire_login").hide();
            $$("#page_profile").show();
        }
        self.swiper = MyApp.fw7.app.swiper.get('.demo-swiper1');
        MyApp.fw7.app.on('ProfileUpdate', function (a) {
            $scope.user = a;
            self.sync();
        });
	};

    $scope.setColor = function(color) {
        $scope.color = color;
        self.sync();
    };

    $scope.checkFutur = function(date) {
        return (new Date() > date);
    };

    $scope.setArticle = function(a) {
        $scope.current = a;
        self.sync();
    };
    
    $scope.Login = function() {
        let email = $scope.email;
        let passw = $scope.password;
        console.log(email + " / " + passw);
        MyApp.fw7.app.preloader.show();
        var data = {
            email: email,
            password: passw
        };
        supe.auth.signInWithPassword(data).then((response) => {
            MyApp.fw7.app.preloader.hide();
            console.log(response);
            if (response.error) {
                alert(response.error.message);
            }
            else {
                $scope.user = response.data.user;
                global.user = response.data.user;
                self.sync();
                $$("#formulaire_login").hide();
                $$("#page_profile").show();
                self.updateuser(response.data.user);
                localStorage.setItem("session", JSON.stringify(response.data));
                let remindMe = document.getElementById("rememberme").checked;
                if (remindMe) {
                    localStorage.setItem("credentials", JSON.stringify(data));
                }
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
                full_name: $scope.reg_fullname,
                telephone: $scope.reg_phone
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

    $scope.forgotpw = function() {
        supe.auth.api.resetPasswordForEmail($scope.forgot_login).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.warn(error);
        });
    };

    $scope.logout = function() {
        $scope.user = null;
        self.sync();
        MyApp.fw7.app.preloader.show();
        setTimeout(function() {
            $$("#page_profile").hide();
            $$("#formulaire_login").show();
            MyApp.fw7.app.preloader.hide();
            localStorage.removeItem("session");
        }, 500);
    };

    $scope.setTab = function(tab_name) {
        global.active_tab = tab_name;
        $scope.menu_item = tab_name;
        if (tab_name == 'rdv') {
            self.getRdv();
        }
        else if (tab_name == 'trends') {
            self.getTop();
            self.getTrends();
        }
        self.sync();
    };

    self.getTop = function() {
        supe.from('tendances_articles')
        .select('*')
        .is('top', true)
        .then((response) => {
            console.log(response);
            $scope.top_article = response.data[0];
            self.sync();
        }).catch((error) => {
            console.warn(error);
        });
    };

    self.getRdv = function() {
        if (!global.user || !global.user.id) return;
        supe.from('Rendezvous')
        .select('id, date, time, utilisateur, opticien(id, name, image), motif, informations')
        .eq('utilisateur', global.user.id)
        .then((response) => {
            console.log(response);
            $scope.rdvs = response.data;
            for (let i=0; i < $scope.rdvs.length; i++) {
                $scope.rdvs[i].rdvdate = new Date($scope.rdvs[i].date);
            }
            self.sync();
        }).catch((error) => {
            console.warn(error);
        });
    };

    self.getTrends = function() {
        supe.from('tendances_categories')
        .select("id, name, tendances_articles(id, titre, soustitre, image, contenu)")
        .then((response) => {
            console.log(response);
            $scope.trends = response.data;
            self.sync();
        }).catch((error) => {
            console.warn(error);
        });
    };

    $scope.OpenOpticien = function(id) {
        mainView.router.navigate("/opticien/" + id + "/");
    };

    $scope.getDate = function(rdv, type) {
        let date = rdv.rdvdate;
        let result = GetDateitem(date, type);
        return result;
    };

    self.updateuser = function(user) {
        supe.from('users')
        .update({ 
            "full_name": user.user_metadata.full_name,
            "telephone": user.user_metadata.telephone
        })
        .eq('id', user.id)
        .then((response) => {
            console.log(response);
        }).catch((error) => {
            console.warn(error);
        });
    };

    $scope.NbAvenir = function(rdvs) {
        if (!rdvs || (rdvs.length <= 0)) return 0;
        else {
            let count = 0;
            for(let i = 0; i < rdvs.length; i++) {
                if (rdvs[i].rdvdate > new Date()) count++;
            }
            return count;
        }
    };

    $scope.NbPassed = function(rdvs) {
        if (!rdvs || (rdvs.length <= 0)) return 0;
        else {
            let count = 0;
            for(let i = 0; i < rdvs.length; i++) {
                if (rdvs[i].rdvdate < new Date()) count++;
            }
            return count;
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