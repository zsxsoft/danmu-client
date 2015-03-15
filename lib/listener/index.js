(function() {
	var config;
	var io;
	module.exports = {
		init: function(cfg) {
			config = cfg;
			io = require("socket.io-client")(config.socket.url);
			realInit();
		}
	};

	var realInit = function() {
		var initCount = 0;
		io.on("init", function(data) {
			initCount++;
			io.emit("password", {password: config.socket.password, room: "client"});
			if (initCount > 1) {
				console.log("连接密码错误");
			}
		});
		io.on("connected", function(data) {
			console.log("已连接上弹幕服务器");
		});
		io.on("danmu", function(data) {
			coordinator.emit("gotDanmu", data);
		})
	};
})();