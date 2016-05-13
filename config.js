({
	socket: {
		url: "http://127.0.0.1:3000",
		password: "",
		room: "unlimited",
		heartbeat: 3000
	},
	display: {
		comment: {
			animationStyle: "scroll",
			fontStyle: "normal bold 5em 微软雅黑",
			fontColor: "rgb(255, 255, 255)",
			lifeTime: 240,
			height: 50
		},
		image: true
	},
	image: {
		regex: /\[IMG WIDTH=(\d+)\](.+?)\[\/IMG\]/ig,
		whitelist: [
			"https://www.baidu.com/img/bd_logo1.png",
			"http://www.baidu.com/img/bd_logo1.png",
		]
	}
});
