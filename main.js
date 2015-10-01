var app = require('app');
var BrowserWindow = require('browser-window');
var packageJson = require('./package.json');
global.coordinator = new(require('events').EventEmitter);
global.windows = {};

require('crash-reporter').start();
coordinator.on('exit', function() {
    app.quit();
});
app.on('window-all-closed', function () {
    app.quit();
});

app.on('ready', function () {

    windows.panelWindow = new BrowserWindow({
        width: 390,
        height: 150, 
        resizable: false, 
        icon: __dirname + '/danmu.png'
    });
    windows.panelWindow.loadUrl('file://' + __dirname + '/panel.html');
    windows.panelWindow.on('closed', function () {
        app.quit();
    });
    windows.panelWindow.setMenu(null);

    windows.mainWindow = new BrowserWindow({
        transparent: true,
        frame: false,
        toolbar: false,
        resizable: true,
        title: "DANMU Client", 
        "always-on-top": true,
        icon: __dirname + '/danmu.png'
    });
    windows.mainWindow.loadUrl('file://' + __dirname + '/index.html');
    windows.mainWindow.on('closed', function () {
        app.quit();        
    });
    windows.mainWindow.setMenu(null);

});
