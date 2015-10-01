/* global panelWindow */
/* global coordinator */
var DD = require('./danmu/ddloader');
var windows = require('remote').getGlobal('windows');
var coordinator = require('remote').getGlobal('coordinator');

var utils = require('../utils');
var player;

// 监听得到弹幕的事件
coordinator.on("gotDanmu", function(data) {
	player.parseDanmus(data, player);
	player.controlDanmu("update");
});
// 监听操作相关事件
coordinator.on("danmuControl", function(data) {
	window.danmuControl[data].call();
});

var showSingleBarrage = function(param) {
	player.parseDanmus([param], player);
	player.controlDanmu("update");
};

module.exports = {
	init: function(config, listener, object) {
		if (config.image.preload) {
			config.image.whitelist.map(function(url){
				var img = window.document.createElement("img");
				img.width = 0;
				img.height = 0;
				img.src = url;
				window.document.body.appendChild(img);
			})
		}
		player = new DD.Player("main-canvas", object);
		player.init("canvas", "fuck");
		player.controlDanmu("play");
		window.setInterval(function() {
			coordinator.emit("fps", player.frame.fps);
		}, 1000);
		window.console.log("弹幕初始化完成！");
	},
	DD: DD
};


// 以下代码，用于给window添加私货
window.danmuControl = {
	send: showSingleBarrage,
	example: function() {
		var i = 1;
		setInterval(function() {
			showSingleBarrage({
				text: '[IMG WIDTH=24]danmu-24.png[/IMG]测试[IMG WIDTH=24]danmu-24.png[/IMG]Hello World[IMG WIDTH=24]danmu-24.png[/IMG]',
				color: "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")", 
				lifeTime: 500, 
				textStyle: "normal bold " + i + "em 微软雅黑",
				height: i * 10
			});
			i++;
			if (i > 5) i = 1;
		}, 20);
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

/*windows.panelWindow.on("danmuControl", function(data) {
	window.danmuControl[data].call();
});
=======

>>>>>>> master
*/