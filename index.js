/* global panelWindow */
/* global global */
(function () {

    var gui = require('nw.gui');
    global.coordinator = new(require('events').EventEmitter);
    global.panelWindow = gui.Window.open('panel.html', {
        toolbar: false,
        resizable: false,
        width: 390,
        height: 150
    });
    gui.Window.get().showDevTools();

    var path = require('path');
    var fs = require('fs');
    var danmu = require("./lib/danmu");
    var listener = require("./lib/listener");
    var penetrate = require("./lib/penetrate");
    var crypto = require('crypto');
    var packageJson = require("./package.json");

    var isStart = false;

    var config = null;
    try {
        config = eval(fs.readFileSync(path.resolve('config.js'), "utf-8"));
    } catch (e) {
        alert("你的config.js修改有误，解析出错：\n" + e.stack.toString());
        windows.mainWindow.openDevTools({detach: true});
        throw e;
    } 

    global.config = config;

    var keydownFunction = function (e) {
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
