var app = require('app');
var BrowserWindow = require('browser-window');
var packageJson = require('./package.json');
global.coordinator = new(require('events').EventEmitter);
global.windows = {};

require('crash-reporter').start();
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {

    windows.mainWindow = new BrowserWindow({
        "transparent": true,
        "frame": false,
        "toolbar": false,
        "always-on-top": true,
        "resizable": true,
        "title": "DANMU Client"
    });
    windows.mainWindow.loadUrl('file://' + __dirname + '/index.html');
    windows.mainWindow.openDevTools({
        detach: true
    });
    windows.mainWindow.on('closed', function () {
        windows.mainWindow = null;
        app.quit();
    });

    windows.panelWindow = new BrowserWindow({
        width: 400,
        height: 200
    });
    windows.panelWindow.loadUrl('file://' + __dirname + '/panel.html');
    windows.panelWindow.on('closed', function () {
        windows.panelWindow = null;
    });

});
