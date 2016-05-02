'use strict';
let penetrate = require("nw-penetrate");

module.exports = {
	init: function () {
		let tranResult = penetrate.penetrate(window.document.title);
		window.console.log(tranResult ? "成功使窗口穿透" : "窗口穿透失败");
		//window.tryDanmu();
	}, 
};
