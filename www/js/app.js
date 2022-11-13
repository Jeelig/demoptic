var $$ = Dom7;

var device = Framework7.getDevice();

var global = {
	user: null
};

global.category_name = '';
global.nblike = 0;
global.scroll = 0;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
	theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init angular
var MyApp = {};
MyApp.config = {};

MyApp.angular = angular.module('MyApp', ["ngTouch"])
/*
This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
	return {
		restrict: 'A',
		replace: false,
		transclude: false,
		link: function(scope, element, attrs) {
			var href = attrs['hrefInappbrowser'];
			attrs.$observe('hrefInappbrowser', function(val) {
				href = val;
			});
			element.bind('click', function (event) {
				window.open(href, '_system', 'location=yes');
				event.preventDefault();
				event.stopPropagation();
			});
		}
	};
});

MyApp.fw7 = {
	app : new Framework7({

    //var app = new Framework7({
        name: "Optic Store Finder", // App name
        theme: "md", // Automatic theme detection
        el: "#app", // App root element
        id: "io.framework7.myapp", // App bundle ID
        // App store
        store: store,
        // App routes
        routes: routes,
		// Dialogs
		dialog: {
			buttonOk: "OK",
			buttonCancel: "Annuler"
		},
		// Swipeout
		swipeout: {
			noFollow: true,
			removeElements: false
		},
        // Input settings
        input: {
            scrollIntoViewOnFocus: device.cordova && !device.electron,
            scrollIntoViewCentered: device.cordova && !device.electron,
        },
        // Cordova Statusbar settings
        statusbar: {
            iosOverlaysWebView: true,
            androidOverlaysWebView: false,
        },
        on: {
            init: function () {
                var f7 = this;
                if (f7.device.cordova) {
                    // Init cordova APIs (see cordova-app.js)
                    cordovaApp.init(f7);
                }
            },
        },
    }),
    views : []
};

var mainView = MyApp.fw7.app.views.create(".view-main");

var myEvents = new Framework7.Events();



document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Now safe to use device APIs
	//alert("Device is ready !");
	navigator.splashscreen.hide();
}

// Login Screen Demo
$$("#my-login-screen .login-button").on("click", function () {
    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    // Close login screen
    MyApp.fw7.app.loginScreen.close("#my-login-screen");

    // Alert username and password
    MyApp.fw7.app.dialog.alert("Username: " + username + "<br/>Password: " + password);
});

var range = MyApp.fw7.app.range.create({
    el: ".range-slider",
    on: {
        change: function () {
            console.log("Range Slider value changed");
        },
    },
});



function log(msg) {
	if (window.console) {
		console.log(msg);
	}
}



global.favoris = [{
	name: "Le bêlleh",
	description: "12 plade de la république, 75012",
	image: "https://cdn.framework7.io/placeholder/fashion-88x88-1.jpg"
}, {
	name: "Don't Stop Me Now",
	description: "4 rue de cambrai, 75019",
	image: "https://cdn.framework7.io/placeholder/fashion-88x88-2.jpg"
}, {
	name: "Billie Jean",
	description: "Michael Jackson",
	image: "https://cdn.framework7.io/placeholder/fashion-88x88-3.jpg"
}];

global.notifications = [];
global.categories = [];
global.business = [];
global.lists = [];
global.selections = [];
global.articles = [];
global.news = [];
global.favorites = [];



function calculheight() {
	let imgHeight = $$(".image-eta2 img").css("height");
	let nvbrHeight = $$(".societe .navbar").css("height");
	let mgTop = parseFloat(imgHeight) - parseFloat(nvbrHeight) - 27;
	let cliqabl = parseFloat(imgHeight) - 52;
	$$(".block.art-content").css("margin-top", mgTop + "px");
	$(".imgCliqable").css("height", cliqabl + "px");
}




function resizemap(a) {
	if (a || (!window.global.hasOwnProperty("resized") && (window.global.resized == false))) {
		window.global.resized = true;
		window.global.map.resize();
	}
}




var cached = [
	{
		type: "html",
		path: "index.html"
	}, {
		type: "html",
		path: "pages/home.html"
	}, {
		type: "html",
		path: "pages/list.html"
	}, {
		type: "html",
		path: "pages/societe.html"
	}, {
		type: "html",
		path: "pages/categories.html"
	}, {
		type: "html",
		path: "pages/profile.html"
	}, {
		type: "html",
		path: "pages/login.html"
	}
];



window.onload = function() {
	/*setTimeout(function() {
		for(let i = 0; i < cached.length; i++) {
			let item = cached[i];
			switch(item.type) {
				case "html":
					// XHR to request a JS and a CSS
					var xhr = new XMLHttpRequest();
					xhr.open('GET', item.path);
					xhr.send('');
					break;
				case "img":
					// preload image
					new Image().src = item.path;
			}
		}
	}, 500);*/
};



/////



(function () {/*
	var host = 'wss://socket.axelib.io:9750';
	var socket = new WebSocket(host);
	socket.params = { it: null, online: false, lastping: null };
	socket.onopen = function(e) {
		console.log("socket opened !");
		socket.params.it = setInterval(function() {
			let now = new Date();
			var seconds = (now.getTime() - socket.params.lastping.getTime()) / 1000;
			if (seconds >= 30) {
				socket.close();
				console.log("Last ping was " + seconds + "sec ago !");
			}
		}, 30000);
	};
	socket.onmessage = function(e) {
		let msg = e.data;
		if (msg.startsWith("tick")) socket.params.lastping = new Date();
		else if(msg == "ping") setTimeout(function() { socket.params.lastping = new Date(); socket.send("pong"); }, 5000);
		else {
			console.log("Message received : " + msg);
		}
	};
	socket.onerror = function(e) {
		console.warn("error from websocket");
	};
	socket.onclose = function(e) {
		clearInterval(socket.params.it);
		console.log("WebSocket closed !");
	};*/
})();


var loadEssentials = {/*
	categories: new Promise((resolve, reject) => {
		supe.from('category')
			.select('*')
		.then((response) => {
			supabase_data_succeed(response, function() {
				global.categories = response.data;
				resolve(10);
			});
		}).catch(supabase_data_fail);
	}),
	news: new Promise((resolve, reject) => {
		supe.from('news')
			.select('*')
		.then((response) => {
			supabase_data_succeed(response, function() {
				global.news = response.data;
				resolve(10);
			});
		}).catch(supabase_data_fail);
	}),
	selections: new Promise((resolve, reject) => {
		supe.from('selection')
		.select(`id, created_at, name, image, description, short, author(first_name, last_name, profile)`)
		.then((response) => {
			supabase_data_succeed(response, function() {
				global.selections = response.data;
				resolve(10);
			});
		}).catch(supabase_data_fail);
	}),
	notifications: new Promise((resolve, reject) => {
		debugger;
		supe.from('notification')
		.select("*")
		.eq('id_user', supe.auth.currentUser.id)
		.then(function(response) {
			supabase_data_succeed(response, function() {
				global.notifications = response.data;
				resolve(10);
			});
		})
		.catch(supabase_data_fail)
	}),
	afrotimes: new Promise((resolve, reject) => {
		supe.from('afrotime')
		.select("*")
		.then(function(response) {
			supabase_data_succeed(response, function() {
				global.afrotimes = response.data;
				resolve(10);
			});
		})
		.catch(supabase_data_fail)
	})*/
};


loadEssentials = {
	categories: function() {
		return new Promise((resolve, reject) => {
			supe.from('category')
				.select('*')
			.then((response) => {
				supabase_data_succeed(response, function() {
					global.categories = response.data;
					resolve(10);
				});
			}).catch(supabase_data_fail);
		})
	},
	news: function() {
		return new Promise((resolve, reject) => {
			supe.from('news')
				.select('*')
				.eq("visible", true)
				.order('main', { ascending: false })
			.then((response) => {
				supabase_data_succeed(response, function() {
					global.news = response.data;
					resolve(10);
				});
			}).catch(supabase_data_fail);
		})
	},
	selections: function() {
		return new Promise((resolve, reject) => {
			supe.from('selection')
			.select(`id, created_at, name, image, description, short, visible, author(first_name, last_name, profile)`)
			.then((response) => {
				supabase_data_succeed(response, function() {
					global.selections = response.data;
					resolve(10);
				});
			}).catch(supabase_data_fail);
		})
	},
	notifications: function() {
		return new Promise((resolve, reject) => {
			supe.from('notification')
			.select("*")
			.eq('id_user', supe.auth.currentUser.id)
			.then(function(response) {
				supabase_data_succeed(response, function() {
					global.notifications = response.data;
					MyApp.fw7.app.emit('gotnotifications');
					resolve(10);
				});
			})
			.catch(supabase_data_fail)
		})
	},
	afrotimes: function() {
		return new Promise((resolve, reject) => {
			supe.from('afrotime')
			.select("*")
			.eq("visible", true)
			.then(function(response) {
				supabase_data_succeed(response, function() {
					global.afrotimes = response.data;
					resolve(10);
				});
			})
			.catch(supabase_data_fail)
		})
	},
	favorites: function() {
		return new Promise((resolve, reject) => {
			supe.from('favorites')
			.select('id, created_at, business(id, name, image), list(id, name)')
			.eq('id_user', supe.auth.currentUser.id)
			.then((response) => {
				//debugger;
				console.log(response);
				global.favorites = response.data;
				MyApp.fw7.app.emit('gotfavorites');
				resolve(10);
			})
			.catch(supabase_data_fail)
		})
	},
	lists: function() {
		//debugger;
		return new Promise((resolve, reject) => {
			supe.from('list')
			.select('*')
			.eq('owner', supe.auth.currentUser.id)
			.then((response) => {
				console.log(response);
				global.lists = response.data;
				MyApp.fw7.app.emit('gotfavorites');
				resolve(10);
			})
			.catch(supabase_data_fail)
		})
	},
	getnblike: function() {
		return new Promise((resolve, reject) => {
			supe.rpc('nblike', { "user_id": supe.auth.currentUser.id })
			.then((response) => {
				//console.log(response);
				//debugger;
				global.nblike = response.data[0].nb;
				MyApp.fw7.app.emit('gotlikes');
				resolve(10);
			})
			.catch(supabase_data_fail)
		})
	}
};

global.points = [];

function GetPageId() {
	let history = MyApp.fw7.app.views.main.history;
	let path = history[history.length-1];
	let id = path.substring(1, path.length - 1);
	id = id.substring(id.lastIndexOf("/") + 1);
	return id;
}


global.bounds = [
	[1.667780, 48.503906], // Southwest coordinates
	[2.919446, 49.171160]  // Northeast coordinates
];


function treatSupaFunction(item, index, arr) {
	Object.keys(item).forEach(key => {
		if (key.substring(0, 2) == "f_") {
			item[key.substring(2)] = item[key];
			delete item[key];
		}
	});
}



function intersectRect(r1, r2) {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

function getVisibleMarkers() {
    var cc = global.map.getContainer();
    var els = cc.getElementsByClassName("mapboxgl-marker");
    var ccRect = cc.getBoundingClientRect();
    var visibles = [];
    for (var i = 0; i < els.length; i++) {
        var el = els.item(i);
        var elRect = el.getBoundingClientRect();
        intersectRect(ccRect, elRect) && visibles.push(el);
    }
    if (visibles.length > 0) console.log(visibles);
	return visibles;
}


function isInMyList(item) {
	if (item == 4) return true;
	return false;
}


function hide_preloader() {
	setTimeout(function() { MyApp.fw7.app.preloader.hide(); MyApp.fw7.app.dialog.close(); }, 350);
}

function supabase_data_fail(e) {
	hide_preloader();
	console.log("API Error !");
	console.warn(e);
}
function supabase_data_succeed(e, callback) {
	hide_preloader();
	console.log(e);
	if (!e.error) {
		callback();
	}
	else supabase_data_fail(e);
}



 
// JavaScript program to calculate Distance Between
// Two Points on Earth
function GetDistance(Point1, Point2)
{
	// Getting latitudes and longitudes
	let lat1 = Point1[0];
	let lat2 = Point2[0];
	let lon1 = Point1[1];
	let lon2 = Point2[1];

	// The math module contains a function
	// named toRadians which converts from
	// degrees to radians.
	lon1 =  lon1 * Math.PI / 180;
	lon2 = lon2 * Math.PI / 180;
	lat1 = lat1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;

	// Haversine formula 
	let dlon = lon2 - lon1; 
	let dlat = lat2 - lat1;
	let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2),2);
	let c = 2 * Math.asin(Math.sqrt(a));

	// Radius of earth in kilometers. Use 3956 for miles
	let r = 6371;

	// calculate the result
	return(c * r);
}

// Driver code
//let lat1 = 53.32055555555556;
//let lat2 = 53.31861111111111;
//let lon1 = -1.7297222222222221;
//let lon2 = -1.6997222222222223;

//document.write(distance(lat1, lat2, lon1, lon2) + " K.M");

function LoginFromRegister() {
	mainView.router.back();
	setTimeout(function() {
		mainView.router.navigate('/login/');
	}, 320);
}
function RegisterFromLogin() {
	mainView.router.back();
	setTimeout(function() {
		mainView.router.navigate('/register/');
	}, 320);
}



function BuildFavLists (MyList) {
	//debugger;
	for(let i = 0; i < MyList.length; i++) {
		MyList[i].favorites = [];
		for (let j = 0; j < global.favorites.length; j++) {
			if (global.favorites[j].list.id == MyList[i].id) {
				MyList[i].favorites.push(global.favorites[j]);
			}
		}
	}
	return MyList;
}

function CheckFirstConnexion() {
	let metaData = supe.auth.currentUser.user_metadata;
	if (!metaData.hasOwnProperty("alreadysigned")) {
		supe.auth.update({
			data: { "alreadysigned": true } 
		}).then((response)=>{
			supabase_data_succeed(response, function() {
				supe.from("users").update({
					"first_name": metaData.first_name,
					"city": metaData.city
				})
				.eq('id', supe.auth.currentUser.id)
				.then((response)=>{
					supabase_data_succeed(response, function() {
						console.log(response);
					});
				}).catch(supabase_data_fail);
			});
		}).catch(supabase_data_fail);
	}
}


global.getMyPosition = function() {
	return [2.346394, 48.859117];
};


global.mapboxglAccessToken = 'pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoiY2l1dTUzcmgxMDJ0djJ0b2VhY2sxNXBiMyJ9.25Qs4HNEkHubd4_Awbd8Og';


function PutMapInFrench(map) {
	//debugger;
	map.getStyle().layers.forEach(function(thisLayer) {
		if (thisLayer.id.indexOf('-label') > 0) {
			map.setLayoutProperty(thisLayer.id, 'text-field', ['get','name_fr']);
		}
	});
}

global.colors = [{ color: "red", hex: "#ff3b30" },
{ color: "green", hex: "#4cd964" },
{ color: "blue", hex: "#2196f3" },
{ color: "pink", hex: "#ff2d55" },
{ color: "yellow", hex: "#ffcc00" },
{ color: "orange", hex: "#ff9500" },
{ color: "purple", hex: "#9c27b0" },
{ color: "deeppurple", hex: "#673ab7" },
{ color: "lightblue", hex: "#5ac8fa" },
{ color: "teal", hex: "#009688" },
{ color: "lime", hex: "#cddc39" },
{ color: "deeporange", hex: "#ff6b22" }];



function timeago() {
	setTimeout(function() {
		$(".timeago").timeago()
	}, 150);
}


function DoMail() {
	let body = "Bonjour MyAfro Maps,\n\r\n\r";
	body += "Ci-dessous les informations concernant notre établissement : \n\r\n\r";
	body += "LOGO ou DEVANTURE DE L’ETABLISSEMENT\n\r\n\r";
	body += "2 PHOTOS DE VOS PRODUITS PHARES\n\r\n\r";
	body += "QU’AIMERIEZ VOUS OFFRIR A NOS AFROLOVERS? CHAMPS LIBRE OBLIGATOIRE\n\r\n\r";
	body += "PRISE D’UN RENDEZ VOUS : CADENDLY (https://calendly.com/myafromaps/partenariat?back=1&month=2022-02)\n\r\n\r";
	body += "NOM DU RESPONSABLE\n\r\n\r";
	body += "EMAIL VALIDE\n\r\n\r";
	body += "TELEPHONE\n\r\n\r";
	window.open("mailto:myafromaps@gmail.com?subject=ANNONCEURS&body=" + encodeURIComponent(body), '_system');
	
}

function GetDateitem(date, type) {
	let result = null;
	switch(type) {
		case "date": result = date.getDate();
			break;
		case "day": result = date.getDay();
			if (result == 1) result = "Lundi";
			else if (result == 2) result = "Mardi";
			else if (result == 3) result = "Mercredi";
			else if (result == 4) result = "Jeudi";
			else if (result == 5) result = "Vendredi";
			else if (result == 6) result = "Samedi";
			else if (result == 0) result = "Dimanche";
			break;
		case "month": result = date.getMonth();
			if (result == 0) result = "Janvier";
			else if (result == 1) result = "Février";
			else if (result == 2) result = "Mars";
			else if (result == 3) result = "Avril";
			else if (result == 4) result = "Mai";
			else if (result == 5) result = "Juin";
			else if (result == 6) result = "Juillet";
			else if (result == 7) result = "Août";
			else if (result == 8) result = "Septembre";
			else if (result == 9) result = "Octobre";
			else if (result == 10) result = "Novembre";
			else if (result == 11) result = "Décembre";
			break;
	}
	return result;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function GetSlots(data, duree) {
	let id = 0;
	for (let i = 0; i < data.length; i++) {
		if (data[i].opt_creneau.length > 0) {
			let slots = [];
			for(let j = 0; j < data[i].opt_creneau.length; j++) {
				let slot = data[i].opt_creneau[j];
				slot.start_time = data[i].date + "T" + slot.heure_debut + ".000";
				slot.start_time = new Date(slot.start_time);
				slot.end_time = data[i].date + "T" + slot.heure_fin + ".000";
				slot.end_time = new Date(slot.end_time);
				//console.log(slot.start_time + " / " + slot.end_time);
				
				let nextSlotStart = slot.start_time;
				
				while (addMinutes(nextSlotStart, duree) <= slot.end_time) {
					let mySlot = {};
					mySlot.id = id;
					mySlot.start = nextSlotStart;
					mySlot.end = addMinutes(nextSlotStart, duree);
					mySlot.view = (mySlot.start.getHours() < 10) ? ("0" + mySlot.start.getHours().toString()) : mySlot.start.getHours().toString();
					mySlot.view += ":";
					mySlot.view += (mySlot.start.getMinutes() < 10) ? ("0" + mySlot.start.getMinutes().toString()) : mySlot.start.getMinutes().toString();
					//console.log("New slot : " + mySlot.start.toString() + " -> " + mySlot.end.toString());
					nextSlotStart = mySlot.end;
					slots.push(mySlot);
					id++;
				}
			}
			data[i].slots = slots;
		}
	}
	return data;
}

function aleo() {
	console.log("toto !");
}