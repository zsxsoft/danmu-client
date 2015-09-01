/* global panelWindow */
/* global coordinator */
var DD = require('./danmu/ddloader');
var player;

// 监听得到弹幕的事件
coordinator.on("gotDanmu", function(data) {
	player.parseDanmus(data, player);
	player.controlDanmu("update");
});
// 监听操作相关事件
global.panelWindow.on("danmuControl", function(data) {
	window.danmuControl[data].call();
});

var showSingleBarrage = function(param) {
	player.parseDanmus([{
		'style': param.style,
		'text': param.text,
		'color': param.color,
		'lifeTime': param.lifeTime
	}], player);
	player.controlDanmu("update");
};

module.exports = {
	init: function(config, listener, object) {
		player = new DD.Player("main-canvas", object, config);
		player.init("canvas", "fuck");
		player.controlDanmu("play");
		window.setInterval(function() {
			global.panelWindow.emit("fps", player.frame.fps);
		}, 1000);
		window.console.log("弹幕初始化完成！");
	},
	DD: DD
};


// 以下代码，用于给window添加私货
window.danmuControl = {
	send: showSingleBarrage,
	example: function() {
		setInterval(function() {
			showSingleBarrage({
				text: "Hello World",
				color: "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"
			});
		}, 10);
	},
	stop: function() {
		player.frame.stopDanmu();
	},
	start: function() {
		player.frame.restartDanmu();
	},
	clear: function() {
		player.frame.clearDanmu();
	}
};

