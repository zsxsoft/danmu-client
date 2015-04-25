var DD = require('./danmu/ddloader');
var player;
/*var resisterSocket = [{
	event: "barrage",
	func: function(data) {
		
	}
}, {
	event: "sendBarrage",
	func: function(data) {
		showSingleBarrage({
			style: "scroll",
			text: data.text,
			color: "red",
			lifeTime: 10 * 60
		});
	}
}];
*/

coordinator.on("gotDanmu", function(data) {
	player.parseDanmus(data, player);
	player.controlDanmu("update");
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
		window.hhh = player;
		console.log("弹幕初始化完成！");
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
console.log(" \n\
===============================\n\
	弹幕控制台使用说明\n\
=============================== \n\
danmuControl.stop(); // 清除全部弹幕并停止接收新弹幕\n\
danmuControl.start(); // 恢复接收新弹幕\n\
danmuControl.clear(); // 清除全部弹幕\n\
\n\n如遇到某些不适宜出现在屏幕的内容，请注意及时对其进行清除！\n\
");