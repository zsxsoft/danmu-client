(function() {
	var gui = require('nw.gui');
	var win = gui.Window.get();
	var config = require("./config");
	var danmu = require("./danmu");
	var listener = require("./listener");
	win.showDevTools();

	var isStart = false;
	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 13 && !isStart) {
			document.getElementById("message").remove();
			document.querySelector(".border").remove();
			document.querySelector("body").style.background = "transparent";
			listener.init(config);
			danmu.init(config, listener, document.getElementById("main-canvas"));
		}
	}, true);

	var resizeFunction = function(e) {
		if (!isStart) {
			document.querySelector(".border").style.width = window.outerWidth - 6 + "px";
			document.querySelector(".border").style.height = window.outerHeight - 6 + "px";
		}
	};
	window.addEventListener("resize", resizeFunction);
	resizeFunction();

})();