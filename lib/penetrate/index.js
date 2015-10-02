var penetrate = require("nw-penetrate");

module.exports = {
	init: function () {
		var tranResult = penetrate.penetrate(window.document.title);
		if (tranResult) {
			window.console.log("成功使窗口穿透！");
		} else {
			window.console.log("窗口穿透失败！");
		}
		//window.tryDanmu();
	}
};
