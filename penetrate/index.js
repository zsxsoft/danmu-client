(function() {
	module.exports = {
		init: function() {
			setTimeout(function() {
				var tranResult = require("nw-penetrate").penetrate(window.document.title);
				console.log(tranResult);
				window.tryDanmu();
			}, 1000);
		}
	}
})();