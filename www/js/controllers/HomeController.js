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
    $scope.firstPicTaken = false;
    $scope.mode = "read";
    $scope.pageVsg = "page1";
    $scope.season = "";
    $scope.eyes_color = "";
    $scope.form = null;

    $scope.email = "";
    $scope.password = "";
    $scope.user = null;
    $scope.rdv_tab = "coming";
    $scope.top_article = null;
    
    $scope.rdvs = [];
    $scope.optics = [];
    $scope.trends = [];

    $scope.offsetMove = 7;

    self.savedArticles = [];

    self.shapePosition = {
        x: 0,
        y: 0,
        z: 0
    };

    $scope.table_forms = {
        "carre": {
            title: "VISAGE CARRÉ",
            description: "Front large, mâchoire saillante. Lignes bien définies, contour anguleux.",
            details: [
                "Les montures papillon, rondes, ovales ou pantos, vont adoucir et allonger votre visage.",
                "Les montures bicolores foncées en haut et claires en bas vont affiner la mâchoire.Choisissez une taille légèrement moins large que votre visage pour l’affiner."
            ]
        }, 
        "ovale": {
            title: "VISAGE OVALE",
            description: "Front et mâchoire arrondis de même largeur. Equilibré en longueur et en largeur. Menton fin",
            details: [
                "Faites vous plaisir. Ovales, rondes, rectangulaires, arrondies, toutes les formes vous iront !",
                "Les montures trop petites vont élargir le visage et inversement."
            ]
        }, 
        "rectangle": {
            title: "VISAGE RECTANGLE",
            description: "Comparable au visage carré mais plus allongé.",
            details: [
                "Adoucissez vos traits en misant sur le contraste formes rondes ou arrondies type «œil de chat» ou «papillon» avec des lignes douces et votre visage rectiligne.",
                "Les montures bicolores foncées en haut et claires en bas ou demi-cerclées vont briser vos contours bien définis."
            ]
        }, 
        "rond": {
            title: "VISAGE ROND",
            description: "Front et mâchoire arrondis de même largeur. Longueur et largeur identique. Joues charnues, pommettes rebondies.",
            details: [
                "Les formes carrées, rectangulaires ou de forme géométrique, vous aideront à redessiner vos traits et à affirmer votre regard.",
                "Privilégiez les montures anguleuses. Évitez les formes rondes."
            ]
        }, 
        "triangle1": {
            title: "VISAGE TRIANGLE BAS ou COEUR",
            description: "Front large, mâchoire étroite. Pommettes peu saillantes, menton pointu.",
            details: [
                "Jouez sur la finesse, les montures fines, rondes ou ovales, étirées sur les bords inférieurs pour équilibrer la partie haute et basse de votre visage. Pourquoi pas des montures percées !",
                "Privilégiez les montures à angles arrondis. Évitez les modèles trop grands ou imposants."
            ]
        }, 
        "triangle2": {
            title: "VISAGE TRIANGLE HAUT",
            description: "Front étroit, mâchoire large. Morphologie assez rare.",
            details: [
                "Soutenez la finesse de votre front avec des montures marquées sur les tempes pour donner du volume à votre visage. Laissez vous tenter par des formes «papillon» .",
                "Privilégiez les montures avec du volume ou de la fantaisie sur la partie supérieure."
            ]
        }
    };

    $scope.colorimetrie = {
        "printemps": {
            "description": "Couleurs nudes et lumineuses.",
            "info": "Optez pour de l'acétate de couleurs naturelles, des clairs lumineux à base de jaune.",
            "attention": "Évitez les couleurs froides comme le bleu ou le violet."
        },
        "été": {
            "description": "Couleurs froides à dominante bleu.",
            "info": "Optez pour de l’acétate transparent, des couleurs froides à base de bleu, des pastels lumineux ou du métal argenté.",
            "attention": "Évitez les couleurs chaudes et les teintes de orange."
        },
        "automne": {
            "description": "Couleurs chaudes et intenses.",
            "info": "Optez pour du métal doré, de l’écaille ou de l’acétate coloré kaki ou marron.",
            "attention": "Évitez les couleurs froides comme le violet et les teintes pastel."
        },
        "hiver": {
            "description": "Couleurs froides et vives.",
            "info": "Optez pour du métal ou l’acétate de couleurs froides et soutenues, bleus froids, vert bouteille, framboise",
            "attention": "Évitez les couleurs chaudes et les teintes pastel comme le rose poudré."
        }
    };
    
    InitService.addEventListener('ready', function () {
        log('HomePageController: ok, DOM ready'); // DOM ready
    });
	
	$scope.init = function() {
        let session = localStorage.getItem("session");
        let credentials = localStorage.getItem("credentials");
        let firstlaunch = localStorage.getItem("firstlaunch");
        $scope.firstPicTaken = false;
        $scope.mode = "read";
        $scope.pageVsg = "page1";
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
        
        MyApp.fw7.app.on("RdvTermine", function(id, note) {
            for (let i = 0; i < $scope.rdvs.length; i++) {
                if ($scope.rdvs[i].id == parseInt(id)) {
                    $scope.rdvs[i].note = note;
                    self.sync();
                }
            }
        });

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
        self.swiper = null;
        MyApp.fw7.app.on('ProfileUpdate', function (a) {
            $scope.user = a;
            self.sync();
        });
        //////////
        //debugger;
        let artcls = localStorage.getItem("savedArticles");
        if (artcls && (artcls != null)) {
            artcls = JSON.parse(artcls);
            if (artcls.length > 0) {
                self.savedArticles = artcls;
            }
        }
	};

    $scope.GoNext = function() {
        $scope.mode = "read";
        if ($scope.pageVsg == "page1") {
            $scope.pageVsg = "page2";
        }
        else if ($scope.pageVsg == "page2") {
            $scope.pageVsg = "page3";
        }
        else if ($scope.pageVsg == "page3") {
            $scope.pageVsg = "page1";
        }
        self.sync();
    };

    $scope.setColor = function(color) {
        $scope.color = color;
        self.sync();
    };

    $scope.checkFutur = function(date) {
        let returnValue = (new Date() > date)
        if (returnValue) {
            //console.log(new Date());
            //console.log("is lower than ");
            //console.log(date);
        }
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
            global.user = null;
            $$("#page_profile").hide();
            $$("#formulaire_login").show();
            MyApp.fw7.app.preloader.hide();
            localStorage.removeItem("session");
        }, 500);
    };

    $scope.GoAfterSale = function() {
        $scope.setTab('rdv');
        $scope.rdv_tab = 'past';
        self.sync();
    };

    $scope.SendOrdonnance = function(rdv) {
        let title = "Optic Store Finder : Ordonnance (RDV " + rdv.date + ")";
        let body = "Bonjour Docteur, <br>Je vous prie de bien vouloir trouver ci-joint mon ordonnance en prévision du rdv du " + rdv.date + ".<br>Bonne réception";
        $(location).attr('href', 'mailto:?subject='
            + encodeURIComponent(title)
            + "&body=" 
            + encodeURIComponent(body)
        );
    };

    $scope.SaveArticle = function(article, state=true) {
        //debugger;
        let saveArticle = {};
        saveArticle.id = article.id;
        if (state) article.saved = true;
        else article.saved = false;
        if (article.top == true) {
            saveArticle.top = true;
        }
        self.savedArticles.push(saveArticle);
        localStorage.setItem("savedArticles", JSON.stringify(self.savedArticles));
        self.sync();
    };

    $scope.setTab = function(tab_name) {
        global.active_tab = tab_name;
        $scope.menu_item = tab_name;
        $scope.mode = "read";
        if (tab_name == 'rdv') {
            self.getRdv();
        }
        else if (tab_name == 'trends') {
            self.getTop();
            self.getTrends();
        }
        else if (tab_name == "vsg") {
            //debugger;
            if (self.swiper == null) {
                self.swiper = MyApp.fw7.app.swiper.get('.swiper-forms');
                global.swiper = self.swiper;
                self.swiper2 = MyApp.fw7.app.swiper.get('.swiper-description');

                //self.swiper2.disable();
                self.swiper.on('slideChange', function (e) {
                    if (e && (e.activeIndex > 0)) {
                        $$(".vsg_down").show();
                        $$(".fab-edit").show();
                        $(".fab.fab-right-bottom").addClass("shunpo");
                        if (e.activeIndex == 1) self.setForms("rond");
                        else if (e.activeIndex == 2) self.setForms("ovale");
                        else if (e.activeIndex == 3) self.setForms("carre");
                        else if (e.activeIndex == 4) self.setForms("triangle1");
                        else if (e.activeIndex == 5) self.setForms("triangle2");
                        else if (e.activeIndex == 6) self.setForms("rectangle");
                    }
                    else {
                        $$(".vsg_down").hide();
                        $$(".fab-edit").hide();
                        $(".fab.fab-right-bottom").removeClass("shunpo");
                    }
                });
                self.CheckChoices();
            }
        }
        self.sync();
    };

    self.setForms = function(form) {
        $scope.form = form;
        self.sync();
        $(".vsg_title2.1st").html($scope.table_forms[form].title);
        $(".vsg_body1.1st").html($scope.table_forms[form].description);
        self.swiper.update();
        self.swiper2.update();
        self.swiper2.slideTo(0, 0);
        self.animatedescription();
    };

    self.animatedescription = function() {
        $(".swiper-description .swiper-slide.swiper-slide-active").animate({
            "margin-left": -80
        }, {
            complete: function (elements) {
                $(".swiper-description .swiper-slide.swiper-slide-active").animate({
                    "margin-left": 0
                });
            }
        });
    };

    $scope.placeForm = function(position) {
        //debugger;
        let o = $scope.offsetMove;
        self.shapePosition = position;
        let item = $$(".swiper-forms .swiper-slide-active > div");
        let w = item.css("width").replace("px", "");
        let h = item.css("height").replace("px", "");
        let mT = item.css("margin-top").replace("px", "");
        let mL = item.css("margin-left").replace("px", "");
        item.animate({
            "width": parseFloat(w) + o*position.z,
            //"width": parseFloat(w) + o*position.z,
            //"height": parseFloat(h) + o*position.z,
            "margin-top": parseFloat(mT) + o*position.y - o*position.z,
            "margin-left": parseFloat(mL) + o*position.x - o*position.z/2
        }, {
            // Animation completed, optional
            complete: function (elements) {
                MyApp.fw7.app.preloader.hide();
                console.log('animation completed');
            }
        });
    };

    $scope.moveForm = function(direction) {
        let index = 0;
        let value = null;
        let value2 = null;
        let value3 = null;
        let property = "";
        let o = $scope.offsetMove;
        let item = $$(".swiper-forms .swiper-slide-active > div");
        switch(direction) {
            case "up": value = item.css("margin-top").replace("px", "");
                item.animate({
                    "margin-top": parseFloat(value) - o
                });
                self.shapePosition["y"]++;
                break;
            case "down": value = item.css("margin-top").replace("px", "");
                item.animate({
                    "margin-top": parseFloat(value) + o
                });
                self.shapePosition["y"]--;
                break;
            case "left": value = item.css("margin-left").replace("px", "");
                item.animate({
                    "margin-left": parseFloat(value) - o
                });
                self.shapePosition["x"]--;
                break;
            case "right": value = item.css("margin-left").replace("px", "");
                item.animate({
                    "margin-left": parseFloat(value) + o
                });
                self.shapePosition["x"]++;
                break;
            case "pinch": value = item.css("width").replace("px", "");
                value2 = item.css("margin-top").replace("px", ""); //item.css("height").replace("px", "");
                value3 = item.css("margin-left").replace("px", "");
                item.animate({
                    "width": parseFloat(value) - o,
                    "margin-top": parseFloat(value2) + o,
                    "margin-left": parseFloat(value3) + (o/2)
                });
                self.shapePosition["z"]--;
                break;
            case "zoom": value = item.css("width").replace("px", "");
                value2 = item.css("margin-top").replace("px", "");
                value3 = item.css("margin-left").replace("px", "");
                item.animate({
                    "width": parseInt(value) + o,
                    "margin-top": parseFloat(value2) - o,
                    "margin-left": parseFloat(value3) - (o/2)
                });
                self.shapePosition["z"]++;
                break;
        }
        console.log(self.shapePosition);
    };

    $scope.SavePreferences = function() {
        self.UploadImage(function(url) {
            self.UpdateVsgImg(url);
        }, function(e) {
            console.warn(e);
        });
    };

    self.UpdateVsgImg = function(url) {
        let data = {
            "VsgImg": url,
            "VsgEyesClr": $scope.eyes_color,
            "VsgSkinClr": $scope.color,
            "VsgHairsClr": $scope.season
        };
        supe.from('users')
        .update(data)
        .eq('id', global.user.id)
        .then((response) => {
            let userChoices = {
                form: $scope.form,
                image: url,
                position: self.shapePosition
            };
            localStorage.setItem("userChoices", JSON.stringify(userChoices));
            MyApp.fw7.app.dialog.alert("Vos choix ont été sauvegardés !", "Merci", function() {
                $scope.GoNext();
            });
            //self.toast('Vos choix ont été sauvegardés');
        }).catch((error) => {
            console.warn(error);
        });
    };

    self.UploadImage = function(success, error) {
        var elem = document.getElementById("file");
        var file = elem.files[0];
        if (!file) {
            if (self.url && (self.url.length > 0)) success(self.url);
            return;
        }
        let filename = GetFileName("vsg", file.name);
        supe.storage.from("visagisme").upload(filename, file)
        .then((response) => {
            if (!response.error) {
                let url = supe.storageUrl + "/object/public/visagisme/" + response.data.path;
                if (success) success(url);
            }
            else console.warn(response);
        }).catch((err) => {
            //elem.removeEventListener("change", self.onimage , false);
            //self.errorhappened();
        });
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
        .select('id, date, active, time, utilisateur, note, opticien(id, name, image), motif, informations').order('date', { ascending: false })
        .eq('utilisateur', global.user.id)
        .is('active', true)
        .then((response) => {
            console.log(response);
            $scope.rdvs = response.data;
            for (let i=0; i < $scope.rdvs.length; i++) {
                let date = new Date($scope.rdvs[i].date + " " + $scope.rdvs[i].time);
                $scope.rdvs[i].rdvdate = date; //new Date($scope.rdvs[i].date);
            }
            self.sync();
        }).catch((error) => {
            console.warn(error);
        });
    };

    $scope.CancelRdv = function(rdv) {
        MyApp.fw7.app.dialog.confirm('Souhaitez-vous annuler ce rendez-vous ?', function () {
            console.log("Cancel rdv !");
            let data = { active: false };
            supe.from('Rendezvous')
            .update(data)
            .eq('id', rdv.id)
            .then(function(response) {
                if (!response.error) {
                    MyApp.fw7.app.dialog.alert("Rendez-vous annulé !", self.getRdv);
                }
                else {
                    console.warn(response);
                    alert("Veuillez re-essayer ulterieurement !");
                }
            }).catch((err) => {
                alert("Veuillez re-essayer ulterieurement !");
            });
        });
    };

    self.getTrends = function() {
        supe.from('tendances_categories')
        .select("id, name, tendances_articles(id, titre, soustitre, image, contenu)")
        .then((response) => {
            console.log(response);
            $scope.trends = response.data;
            self.sync();
            self.getSavedArticles();
        }).catch((error) => {
            console.warn(error);
        });
    };

    self.getSavedArticles = function() {
        if (self.savedArticles.length <= 0) return;
        for(let i = 0; i < $scope.trends.length; i++) {
            for(let j = 0; j < $scope.trends[i].tendances_articles.length; j++) {
                let art = $scope.trends[i].tendances_articles[j];
                //debugger;
                for(let k = 0; k < self.savedArticles.length; k++) {
                    if (art.id == self.savedArticles[k].id) {
                        art.saved = true;
                    }
                }
                $scope.trends[i].tendances_articles[j] = art;
            }
        }
        self.sync();
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

    self.togglefab = function() {
        MyApp.fw7.app.fab.close(".fab.fab-right-bottom");
    };

    $scope.GetPicture = function(from) {
        switch(from) {
            case "from_image": self.getfile();
                break;
            case "from_camera": self.takePicture();
                break;
        }
    };

    self.takePicture = function() {
        navigator.camera.getPicture(self.onSuccess, self.onFail, { 
            quality: 100,
            allowEdit: false, 
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            //destinationType: Camera.DestinationType.FILE_URI,
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 500,
            targetHeight: 500
        });
    };
    
    self.onSuccess = function(imageData) {
        var image = new Image();
        image.src = 'data:image/png;base64,' + imageData; // jpg ?
        $(".pic_area").css("background-image", "url('" + image.src + "')");
        document.getElementById('profileimg').src = "data:image/jpeg;base64," + imageData;
        self.AfterImageReceived();
    };
    
    self.onFail = function(message) {
        alert('Failed because: ' + message);
    }

    self.getfile = function() {
        if (navigator && navigator.hasOwnProperty("camera")) {
            navigator.camera.getPicture(self.onSuccess, self.onFail, { 
                quality: 45,
                allowEdit: false, 
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                //destinationType: Camera.DestinationType.FILE_URI,
                destinationType: Camera.DestinationType.DATA_URL,
                targetWidth: 350,
                targetHeight: 350
            });
        }
        else {
            var elem = document.getElementById("file");
            elem.addEventListener("change", self.onimage);
            elem.click();
        }
    };

    self.onimage = function() {
        var fr = new FileReader();
        var elem = document.getElementById("file");
        elem.removeEventListener("change", self.onimage);
        let url = URL.createObjectURL(elem.files[0]);
        self.url = url;
        document.querySelector(".vsg_graydv.pic_area").style.backgroundImage = "url(" + url + ")";
        self.AfterImageReceived();
        console.log("got image");
        //Set Image into img
        fr.onload = function () {
            document.getElementById("profileimg").src = fr.result;
        }
        fr.readAsDataURL(elem.files[0]);
    };

    $scope.isLoggedIn = function() {
        let loggedIn = false;
        if (global.user && global.user.id) loggedIn = true;
        return loggedIn;
    };

    self.AfterImageReceived = function() {
        $scope.firstPicTaken = true;
        self.sync();
        self.togglefab();
        setTimeout(() => {
            self.swiper.update();
        }, 500);
    };

    self.CheckChoices = function() {
        let choices = localStorage.getItem("userChoices");
        if (choices != null) {
            choices = JSON.parse(choices);
            if (choices.hasOwnProperty("form")) {
                MyApp.fw7.app.preloader.show();
                $scope.firstPicTaken = true;
                self.togglefab();
                self.sync();
                /**/
                self.url = choices.image;
                document.getElementById('profileimg').src = choices.image;
                $(".pic_area").css("background-image", "url('" + choices.image + "')");
                /**/
                setTimeout(() => {
                    self.swiper.update();
                    let found = false;
                    while (!found) {
                        self.swiper.slideNext(0);
                        if ($scope.form == choices.form) {
                            found = true;
                            MyApp.fw7.app.preloader.hide();
                            $scope.placeForm(choices.position);
                        }
                    }
                }, 500);
            }
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