/// <reference path="typings/node/node.d.ts"/>
(function () {
	var gui = require('nw.gui');
	var win = gui.Window.get();
	var controlButtons = window.document.querySelectorAll(".btn-control");
	var countQuitValue = 0;
	var controlButtonClick = function () {
		win.emit(this.getAttribute("data-top"), this.getAttribute("data-param"));
	};

	win.on("fps", function(fps) {
		document.getElementById("txt-fps").innerText = fps;
	});
	
	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 123) { // F12
			win.showDevTools();
		}
	}, true);
	document.querySelector("#btn-quit").addEventListener("click", function () {
		if (countQuitValue == 1) {
			process.exit();
		} else {
			setTimeout(function () {
				document.querySelector("#btn-quit").innerText = "退出程序";
				countQuitValue = 0;
			}, 5000);
			this.innerText = "5秒内再按一次退出";
			countQuitValue = 1;
		}
		return false;
	});
	for (var i = 0; i < controlButtons.length; i++) {
		controlButtons.item(i).addEventListener("click", controlButtonClick);
	}
	

})();