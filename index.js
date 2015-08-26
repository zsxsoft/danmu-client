/* global panelWindow */
/* global global */
(function() {
    var windows = require('remote').getGlobal('windows');
    var coordinator = require('remote').getGlobal('coordinator');


    var config = require("./config");
    var danmu = require("./lib/danmu");
    var listener = require("./lib/listener");
    var penetrate = require("./lib/penetrate");
    var crypto = require('crypto');
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
    var keydownFunction = function(e) {
        if (e.keyCode == 13 && !isStart) {
            initFunction();
        }
    }

    document.title = "DANMU Client - Client ID = " + crypto.createHash('md5').update(Math.random().toString()).digest('hex');
    window.addEventListener('keydown', keydownFunction);
    document.querySelector("#btn-open").addEventListener("click", initFunction);

})();
