MyApp.angular.controller('MainController', ['$scope', '$compile', '$rootScope', function($scope, $compile, $rootScope) {
    
    global.compiledpages = [];
	var self = this;
    var compiledonce = ["home", "tabs-swipeable", "catalog", "business"];
	
	$scope.code = "";
	$scope.view = "vente"; //tickets, catalog, clients, stats, parametres
	
	$scope.menu = [{
		name: "Accordion",
		path: "/accordion/"
	}, {
		name: "Action sheet",
		path: "/action-sheet/"
	}, {
		name: "Badge",
		path: "/badge/"
	}, {
		name: "Buttons",
		path: "/buttons/"
	}, {
		name: "Cards",
		path: "/cards/"
	}, {
		name: "Checkbox",
		path: "/checkbox/"
	}, {
		name: "Chips/Tags",
		path: "/chips/"
	}, {
		name: "Contacts List",
		path: "/contacts-list/"
	}, {
		name: "Data Table",
		path: "/data-table/"
	}];

    var cancompile = function(e) {
        let res = true;
		let PageName = e.detail.name;
		let PageFrom = "";
		if (e.detail.hasOwnProperty("pageFrom")) {
			if (e.detail.pageFrom && e.detail.pageFrom.hasOwnProperty("name"))
				PageFrom = e.detail.pageFrom.name;
		}
        if ((compiledonce.indexOf(PageName) >= 0) &&            // Page should be compiled once
            (global.compiledpages.indexOf(PageName) >= 0)) {    // Page has already been compiled
            res = false;
        }
		else {
			console.log(PageFrom + "/" + PageName);
			if ((PageFrom == "home") && (PageName == "opticien")) {
				res = false;
			}
			if ((PageFrom == "home") && (PageName == "opticiens")) {
				res = false;
			}
			if ((PageFrom == "rendezvous") && (PageName == "opticien")) {
				res = false;
			}
			if ((PageFrom == "profile") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "howitworks") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "aftersale") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "aftersale") && (PageName == "rendezvous")) {
				res = false;
			}
			if ((PageFrom == "rendezvous") && (PageName == "aftersale")) {
				res = false;
			}
			if ((PageFrom == "rendezvous") && (PageName == "clickncollect")) {
				res = false;
			}
			if ((PageFrom == "clickncollect") && (PageName == "rendezvous")) {
				res = false;
			}
			if ((PageFrom == "contact") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "independants") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "parameters") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "opticien") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "opticiens") && (PageName == "home")) {
				res = false;
			}
			if ((PageFrom == "opticiens") && (PageName == "opticien")) {
				res = false;
			}
			if ((PageFrom == "opticien") && (PageName == "opticiens")) {
				res = false;
			}
			if ((PageFrom == "opticien") && (PageName == "favorites")) {
				res = false;
			}
			if ((PageFrom == "engagements") && (PageName == "home")) {
				res = false;
			}
		}
        return res;
    };

    //$$(document).on('page:afterin', function(e) {
    $$(document).on('page:beforein', function(e) {
        // Never recompile index page
        var page = e.detail;
		//console.log("compiling maybe !");
        //if (cancompile(page.name) || (e.target.className.indexOf("ng-scope")<=0)) {
		if (cancompile(e) || (e.target.className.indexOf("ng-scope")<=0)) {
            // Ajax pages must be compiled first
			$compile(e.target)($scope);
			if (!$scope.$$phase) {
				$scope.$digest();
				$scope.$apply();
			}
            //$scope.$apply();
            if (global.compiledpages.indexOf(page.name) < 0) {
                global.compiledpages.push(page.name);
            }
        }
        // Send broadcast event when switching to new page
        $rootScope.$broadcast(page.name + 'PageEnter', e);
    });
	/*
	$$(document).on('popup:open', function (e) {
		$compile(e.target)($scope);
        $scope.$apply();
        // Send broadcast event when switching to new page
        $rootScope.$broadcast('PopupEnter', e);
	});*/

    $$(document).on('pageAfterAnimation', function(e) {
        // Send broadcast if a page is left
        var fromPage = e.detail.page.fromPage;
		//console.log("compiling !");
        if (fromPage) {
            $rootScope.$broadcast(fromPage.name + 'PageLeave', e);
            if (fromPage.name != 'tabs-swipeable') {
				debugger;
                var prevPage = angular.element(document.querySelector('#'+fromPage.name));
                prevPage.remove();
            }
        }
    });

	$scope.Pay = function() {
		//MyApp.fw7.app.views.main.router.navigate('/page1/');
	};
	
	$scope.SetProfile = function(a) {
		$scope.profile = a;
		$scope.store_name = MyApp.ax.store.get("store")["name"];
		self.sync();
	};
	
	$scope.SetCode = function() {
		$scope.code = global.code;
		self.sync();
	};
    
	$scope.SetBrands = function() {
		let el = document.getElementById('HomePage');
		if (el) angular.element(el).scope().ResizeBrands();
	};
	
	$scope.SetHome = function() {
		$scope.view = "vente";
		self.sync();
	};
	
	$scope.OpenPanel = function() {
		setTimeout(function() {
			panelLeft.open(true);
		}, 50);
	};
	
    self.sync = function () {
        if (!$scope.$$phase) {
            $scope.$digest();
            $scope.$apply();
        }
    };
	
    $scope.logout = function() {
        MyApp.ax.user = null;
        MyApp.ax.session = null;
        MyApp.ax.store.del("session");
        global.compiledpages = [];
        MyApp.fw7.app.views.main.router.navigate('/');
    };
	
	$scope.firstconnexion = false;
	
	// Init
	//self.store = MyApp.ax.store.get("store");
	//if (self.store && self.store.hasOwnProperty("profiles")) {
	//	if (self.store.profiles.length == 0) {
	//		$scope.firstconnexion = true;
	//		global.setadminpw = true;
	//		pops("Bienvenu(e) sur HeadLight POS !");
	//		self.sync();
	//	}
	//}

}]);