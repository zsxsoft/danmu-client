(function() {
	module.exports = {
		init: function() {
			setTimeout(function() {
				var tranResult = require("electron-penetrate").penetrate(window.document.title);
				if (tranResult) {
					window.console.log("成功使窗口穿透！");
				} else {
					window.console.log("窗口穿透失败！");
				}
				//window.tryDanmu();
			}, 1000);
		}
	};
})();