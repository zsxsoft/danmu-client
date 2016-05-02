/* global config */
'use strict';
let packageJson = require("../../package.json");
let player = require('../danmu/index');
let Socket = require("socket.io-client");
let io;
let coordinator = require('remote').getGlobal('coordinator');
let serverRandomNumber = null;
module.exports = {
	init: function () {
		io = Socket(config.socket.url);
		io.heartbeatTimeout = config.socket.heartbeat;
		realInit(config);
	}, 
};

let realInit = function () {
	let initCount = 0;
	io.on("init", data => {
		initCount++;
		io.emit("password", {
			password: config.socket.password,
			room: config.socket.room, 
			info: {
				version: packageJson.version, 
			}, 
		});
		if (initCount > 1) {
			window.console.log("连接密码错误");
		}
	});
	io.on("connected", data => {
		initCount = 0;
		window.console.log("已连接上弹幕服务器（" + data.version + "）");
		if (serverRandomNumber !== data.randomNumber) {
			if (serverRandomNumber !== null) window.console.log("服务器似乎已重启，将清空弹幕池。")
			// 如果断线（服务器重启？）了，必须清理原有弹幕，否则会导致ID池不匹配
			player.stop();
			player.clear();
			player.start();
			serverRandomNumber = data.randomNumber;
		}

	});
	io.on("disconnect", data => {
		window.console.warn("与服务器的连接中断");
	})
	io.on("danmu", data => {
		window.console.log("得到" + data.data.length + "条弹幕");
		coordinator.emit("gotDanmu", data.data);
	});
	io.on("delete", data => {
		window.console.log("删除" + data.ids.length + "条弹幕");
		coordinator.emit("deleteDanmu", data);
	});
};
