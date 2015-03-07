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
window.barrage = showSingleBarrage;

module.exports = {
	init: function(config, listener, object) {
		player = new DD.Player("main-canvas", object);
		player.init("canvas", "fuck");
		player.controlDanmu("play");
		console.log(showSingleBarrage);
	},
	DD: DD
};