/* global config */
var packageJson = require("../../package.json");
var Socket = require("socket.io-client");
var io;
var coordinator = require('remote').getGlobal('coordinator');
module.exports = {
	init: function () {
		io = Socket(config.socket.url);
		io.heartbeatTimeout = config.socket.heartbeat;
		realInit(config);
	}
};

var realInit = function () {
	var initCount = 0;
	io.on("init", function (data) {
		initCount++;
		io.emit("password", {
			password: config.socket.password,
			room: config.socket.room, 
			info: {
				version: packageJson.version
			}
		});
		if (initCount > 1) {
			window.console.log("连接密码错误");
		}
	});
	io.on("connected", function (data) {
		window.console.log("已连接上弹幕服务器");
	});
	io.on("danmu", function (data) {
		window.console.log("得到" + data.data.length + "条弹幕");
		coordinator.emit("gotDanmu", data.data);
	});
	io.on("delete", function (data) {
		window.console.log("删除" + data.ids.length + "条弹幕");
		coordinator.emit("deleteDanmu", data);
	});
};
