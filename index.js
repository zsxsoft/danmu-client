/* global panelWindow */
/* global global */
(function () {
    var windows = require('remote').getGlobal('windows');
    var coordinator = require('remote').getGlobal('coordinator');
    var config = require("./config");
    var danmu = require("./lib/danmu");
    var listener = require("./lib/listener");
    var penetrate = require("./lib/penetrate");
    var crypto = require('crypto');
    var packageJson = require("./package.json");
    var isStart = false;

    var initFunction = function() {
        windows.mainWindow.setResizable(false); // Electron doesn't support both resizable and transparency 
        document.getElementById("message").remove();
        document.querySelector(".border").remove();
        document.querySelector("body").style.background = "transparent";

        listener.init(config);
        danmu.init(config, listener, document.getElementById("main-canvas"));
        penetrate.init();
        isStart = true;
    }
    global.config = config;
    var keydownFunction = function (e) {
        switch (e.keyCode) {
        case 13:
            if (!isStart) {
                initFunction();
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
