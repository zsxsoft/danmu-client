/* global panelWindow */
/* global global */
'use strict';
(function () {

    let windows = require('remote').getGlobal('windows');
    let coordinator = require('remote').getGlobal('coordinator');
    let path = require('path');
    let fs = require('fs');
    let shell = require('shell');
    
      windows.mainWindow.openDevTools({
          detach: true
      });
    
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
        windows.mainWindow.openDevTools({detach: true});
        throw e;
    } 

    global.config = config;

    function initFunction() {
        windows.mainWindow.setResizable(false); // Electron doesn't support both resizable and transparency 
        document.getElementById("message").remove();
        document.querySelector(".border").remove();
        document.querySelector("body").style.background = "transparent";

        listener.init(config);
        danmu.init(config, listener, document.getElementById("main-canvas"));
        penetrate.init();
        isStart = true;
    }

    function keydownFunction(e) {
        switch (e.keyCode) {
        case 13:
            if (!isStart) {
                initFunction();
                isStart = true;
            }
            break;
        case 116:
            e.preventDefault();
        break;
        case 112:
            shell.openExternal(packageJson.homepage);
            break;
        case 123:
            windows.mainWindow.openDevTools({
                detach: true, 
            });
            break;
        }
    }

    document.getElementById("client-version").innerHTML = packageJson.version;
    document.getElementById("client-homepage").innerHTML = packageJson.homepage;
    document.getElementById("client-author").innerHTML = packageJson.author;
    document.title = "DANMU Client - Client ID = " + crypto.createHash('md5').update(Math.random().toString()).digest('hex');
    window.addEventListener("keydown", keydownFunction, true);

})();
