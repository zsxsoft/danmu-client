/* global panelWindow */
/* global coordinator */
'use strict';

let windows = require('remote').getGlobal('windows');
let coordinator = require('remote').getGlobal('coordinator');
let Player = require('./player');
let utils = require('../utils');

let player = new Player();
// 监听得到弹幕的事件
coordinator.on("gotDanmu", function(data) {
    player.parseDanmus(data);
    player.controlDanmu("update");
});
// 监听操作相关事件
coordinator.on("danmuControl", function(data) {
    window.danmuControl[data].call();
});
// 删除弹幕事件
coordinator.on("deleteDanmu", function(data) {
    player.deleteDanmus(data.ids);
});

function sendSingle(param) {
    player.parseDanmus([param]);
    player.controlDanmu("update");
};

function init(config, listener, object) {
    if (config.image.preload) {
        config.image.whitelist.map(function(url) {
            let img = window.document.createElement("img");
            img.width = 0;
            img.height = 0;
            img.src = url;
            window.document.body.appendChild(img);
        })
    }
    player.setup("#main-canvas", "canvas-danmu");
    player.controlDanmu("play");
    window.setInterval(function() {
        coordinator.emit("fps", player.frame.fps);
    }, 1000);
    window.console.log("弹幕初始化完成！");
};


// 以下代码，用于给window添加私货
window.danmuControl = {
    send: sendSingle,
    example: function() {
        let i = 1;
        setInterval(function() {
            sendSingle({
                text: '[IMG WIDTH=24]danmu-24.png[/IMG]测试[IMG WIDTH=24]danmu-24.png[/IMG]Hello World[IMG WIDTH=24]danmu-24.png[/IMG]',
                color: "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")",
                lifeTime: 500,
                textStyle: "normal bold " + i + "em 微软雅黑",
                height: i * 10,
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
    },
};

module.exports = {
    init,
};
