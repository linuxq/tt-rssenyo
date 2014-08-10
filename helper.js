// provide our own console if it does not exist, huge dev aid!
if (typeof window.console == "undefined") {
	window.console = {log:function(str){window.external.Notify(str);}};
};

// output any errors to console log, created above.
window.onerror = function(e) {
	console.log("window.onerror ::" + JSON.stringify(e));
};

console.log("Installed console ! ");

function onDeviceReady(e) {
	if (window.device) {
		console.log(device.platform);
	}
	console.log("deviceready event fired!");
	document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackButton, false);
	//document.addEventListener("menubutton", onMenuButton, false);
	document.addEventListener("keyboard", function() {}, false);
	document.addEventListener("keyboardHidden", function() {}, false);
	document.addEventListener("orientation", function() {}, false);
	document.addEventListener("screenLayout", function() {}, false);
	//window.setTimeout(startApp, 5000);
	startApp();
};
function startApp() {
	console.log("startApp in helper.js");
	window.PalmSystem && window.PalmSystem.setWindowOrientation("free");
	window.PalmSystem && window.PalmSystem.stageReady();
	if (!window.App) {
		alert('No application build found, redirecting to debug.html.');
		location = 'debug.html';
	}
	mt = new App().renderInto(document.body);
};
function onResume(e) {
	console.log("resume event fired!");
	mt.resume();
};
function onExit(e) {
	console.log("exit event fired!");
};
function onBackButton(e) {
	console.log("backbutton event fired!");
	mt.backButton();
};
function onSwipeDown(e) {
	console.log("menubutton event fired!");
	mt.swipedown();
};

Mojo = window.Mojo || {};
// LunaSysMgr calls this when the windows is minimized or closed.
Mojo.stageDeactivated = function() {
	mt.pause();
};

// call onDeviceReady on desktop browser
window.onload = function () {
	document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("exit", onExit, false);

	console.log("window.onload");
	//console.log(navigator.userAgent);
	gblDebug = true;
	gblAndroid = false;
	gblDesktop = false;
	gblBB10 = false;
	gblWebos = false;
	gblFirefox = false;
	gblPlaybook = false;
	if (navigator.userAgent.indexOf("Android") > -1) {
		gblAndroid = true;
		console.log("Running on: Android");
	}
	if (navigator.userAgent.indexOf("Chrome") > -1) {
		if (navigator.userAgent.indexOf("Linux") > -1) {
			gblDesktop = true;
			console.log("Running on: Desktop Chrome Linux");
			// call onDeviceReady on windows desktop (chrome)
			onDeviceReady();
		} else if (navigator.userAgent.indexOf("Windows") > -1) {
			gblDesktop = true;
			console.log("Running on: Desktop Chrome Windows");
			// call onDeviceReady on windows desktop (chrome)
			onDeviceReady();
		} else if (navigator.userAgent.indexOf("Macintosh") > -1) {
			gblDesktop = true;
			console.log("Running on: Desktop Chrome Macintosh");
			// call onDeviceReady on windows desktop (chrome)
			onDeviceReady();
		}
	}
	if (navigator.userAgent.indexOf("Firefox") > -1) {
		if (navigator.userAgent.indexOf("Windows") > -1) {
			gblDesktop = true;
			console.log("Running on: Desktop Firefox Windows");
		} else if (navigator.userAgent.indexOf("Linux") > -1) {
			gblDesktop = true;
			console.log("Running on: Desktop Firefox Linux");			
		} else if (navigator.userAgent.indexOf("Macintosh") > -1) {
			gblDesktop = true;
			console.log("Running on: Desktop Firefox Macintosh");			
		} else if (navigator.userAgent.indexOf("Gecko") > -1) {
			gblFirefox = true;
			console.log("Running on: FirefoxOS");
			//window.screen.onmozorientationchange = function () {
			//	enyo.Signals.send("onOrientationChange");
			//};
		}
		// call onDeviceReady on windows desktop (chrome)
		onDeviceReady();
	}
	//console.log("BLACKBERRY: " + typeof blackberry);
	if (typeof blackberry != "undefined") {
		// call onDeviceReady on windows desktop (chrome)
		console.log("Running on: unknown");
		onDeviceReady();
	}
	if (navigator.userAgent.indexOf("BB10") > -1) {
		gblBB10 = true;
		blackberry.event.addEventListener("resume", onResume);
		blackberry.event.addEventListener("swipedown", onSwipeDown, false);
		console.log("Running on: BlackBerry 10");
		onDeviceReady();
	}
	if (navigator.userAgent.indexOf("PlayBook") > -1) {
		gblPlaybook = true;
		blackberry.event.addEventListener("resume", onResume);
		blackberry.event.addEventListener("swipedown", onSwipeDown, false);
		console.log("Running on: Blackberry Playbook");
		onDeviceReady();
	}	
	if (window.PalmSystem) {
		// call stageReady on webos
		window.PalmSystem.stageReady();
		gblWebos = true;
		console.log("Running on: webOS");
		
		onDeviceReady();
	}
}
