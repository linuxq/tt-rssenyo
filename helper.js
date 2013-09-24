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
	document.addEventListener("menubutton", onMenuButton, false);
	document.addEventListener("keyboard", function() {}, false);
	document.addEventListener("keyboardHidden", function() {}, false);
	document.addEventListener("orientation", function() {}, false);
	document.addEventListener("screenLayout", function() {}, false);
	//window.setTimeout(startApp, 5000);
	startApp();
};
function startApp() {
	console.log("startApp");
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
function onMenuButton(e) {
	console.log("menubutton event fired!");
	mt.openAboutBox();
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
	console.log(navigator.userAgent);
	gblAndroid = false;
	gblDesktop = false;
	gblBB10 = false;
	gblWebos = false;
	if (navigator.userAgent.indexOf("Android") > -1) {
		gblAndroid = true;
	}
	if (navigator.userAgent.indexOf("Chrome") > -1) {
		if (navigator.userAgent.indexOf("Linux") > -1) {
			gblDesktop = true;
			// call onDeviceReady on windows desktop (chrome)
			onDeviceReady();
		} else if (navigator.userAgent.indexOf("Windows") > -1) {
			gblDesktop = true;
			// call onDeviceReady on windows desktop (chrome)
			onDeviceReady();
		} else if (navigator.userAgent.indexOf("Macintosh") > -1) {
			gblDesktop = true;
			// call onDeviceReady on windows desktop (chrome)
			onDeviceReady();
		}
	}
	if (navigator.userAgent.indexOf("Firefox") > -1) {
		if (navigator.userAgent.indexOf("Windows") > -1) {
			gblDesktop = true;
		}
		gblFirefox = true;
		// call onDeviceReady on windows desktop (chrome)
		onDeviceReady();
	}
	//console.log("BLACKBERRY: " + typeof blackberry);
	if (typeof blackberry != "undefined") {
		// call onDeviceReady on windows desktop (chrome)
		onDeviceReady();
	}
	if (navigator.userAgent.indexOf("BB10") > -1) {
		gblBB10 = true;
		onDeviceReady();
	}
	if (window.PalmSystem) {
		// call stageReady on webos
		window.PalmSystem.stageReady();
		gblWebos = true;
		onDeviceReady();
	}
}
