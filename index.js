/* global panelWindow */
/* global global */
'use strict';
(function () {

    let gui = require('nw.gui');
    let windows = require('remote').getGlobal('windows');
    global.coordinator = new(require('events').EventEmitter);
    global.panelWindow = gui.Window.open('panel.html', {
        toolbar: false,
        resizable: false,
        width: 390,
        height: 150
    });
    gui.Window.get().showDevTools();
    let path = require('path');
    let fs = require('fs');
    let shell = require('shell');
    
    
    let danmu = require("./lib/danmu");
    let listener = require("./lib/listener");
    let penetrate = require("./lib/penetrate");
    let crypto = require('crypto');
    let packageJson = require("./package.json");

    let isStart = false;

    let config = null;
    try {
        config = eval(fs.readFileSync(path.resolve('config.js'), "utf-8"));
    } catch (e) {
        alert("你的config.js修改有误，解析出错：\n" + e.stack.toString());
        gui.Window.get().showDevTools();
        throw e;
    } 

    global.config = config;

    let keydownFunction = function (e) {
        switch (e.keyCode) {
        case 13:
            if (!isStart) {
                document.getElementById("message").remove();
                document.querySelector(".border").remove();
                document.querySelector("body").style.background = "transparent";

                listener.init(config);
                danmu.init(config, listener, document.getElementById("main-canvas"));
                penetrate.init();

                isStart = true;
            }
            break;
        case 112:
            gui.Shell.openExternal(packageJson.homepage);
            break;
        case 123:
            gui.Window.get().showDevTools();
        break;
        }
    }

    document.getElementById("client-version").innerHTML = packageJson.version;
    document.getElementById("client-homepage").innerHTML = packageJson.homepage;
    document.getElementById("client-author").innerHTML = packageJson.author;

    document.title = "DANMU Client - Client ID = " + crypto.createHash('md5').update(Math.random().toString()).digest('hex');
    window.addEventListener("keydown", keydownFunction, true);

})();
