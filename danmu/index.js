var DD = require('./danmu/ddloader');
var player;
/*var resisterSocket = [{
	event: "barrage",
	func: function(data) {
		player.parseDanmus(data.data, player);
		player.controlDanmu("update");
	}
}, {
	event: "sendBarrage",
	func: function(data) {
		showSingleBarrage({
			style: "Scroll",
			text: data.text,
			color: "red",
			lifeTime: 10 * 60
		});
	}
}];
*/

var showSingleBarrage = function(param) {
	player.parseDanmus([{
		'style': param.style,
		'text': param.text,
		'color': param.color,
		'lifeTime': param.lifeTime
	}], player);
	player.controlDanmu("update");
}
	// Test Code
window.barrage = showSingleBarrage;
window.tryDanmu = function() {
	setInterval(function() {
		showSingleBarrage({
			text: "Hello World",
			color: "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"
		})
	}, 10);
}

module.exports = {
	init: function(config, listener, object) {
		player = new DD.Player("main-canvas", object, config);
		player.init("canvas", "fuck");
		player.controlDanmu("play");
	},
	DD: DD
};