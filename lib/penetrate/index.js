(function() {
	module.exports = {
		init: function() {
			setTimeout(function() {
				var tranResult = require("electron-penetrate").penetrate(window.document.title);
				if (tranResult) {
					console.log("成功使窗口穿透！");
				} else {
					console.log("窗口穿透失败！");
				}
				//window.tryDanmu();
			}, 1000);
		}
	};
})();