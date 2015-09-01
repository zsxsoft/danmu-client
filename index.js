/* global panelWindow */
/* global global */
(function () {
	var gui = require('nw.gui');
	global.coordinator = new (require('events').EventEmitter);
	global.panelWindow = gui.Window.open('panel.html', {
		toolbar: false,
		resizable: true,
		width: 400,
		height: 200
	});


	var config = require("./config");
	var danmu = require("./lib/danmu");
	var listener = require("./lib/listener");
	var penetrate = require("./lib/penetrate");
	var crypto = require('crypto');
	var isStart = false;
	var keydownFunction = function (e) {

		if (e.keyCode == 13 && !isStart) {
			document.getElementById("message").remove();
			document.querySelector(".border").remove();
			document.querySelector("body").style.background = "transparent";

			listener.init(config);
			danmu.init(config, listener, document.getElementById("main-canvas"));
			penetrate.init();

			isStart = true;
		}

		if (e.keyCode == 123) { // F12
			gui.Window.get().showDevTools();
		}

	}

	document.title = "DANMU Client - Client ID = " + crypto.createHash('md5').update(Math.random().toString()).digest('hex');
	window.addEventListener("keydown", keydownFunction, true);

})();