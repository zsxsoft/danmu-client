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

// 测试用代码
window.barrage = showSingleBarrage;
window.tryDanmu = function() {
	setInterval(function() {
		showSingleBarrage({
			text: "Hello World",
			color: "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"
		});
	}, 10);
};

module.exports = {
	init: function(config, listener, object) {
		player = new DD.Player("main-canvas", object, config);
		player.init("canvas", "fuck");
		player.controlDanmu("play");
		console.log("弹幕初始化完成！");
	},
	DD: DD
};