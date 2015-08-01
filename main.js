var app = require('app');
var BrowserWindow = require('browser-window');
var packageJson = require('./package.json');
global.coordinator = new(require('events').EventEmitter);
global.windows = {};



// Report crashes to our server.
require('crash-reporter').start();
// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    windows.mainWindow = new BrowserWindow(packageJson.window);
    windows.mainWindow.loadUrl('file://' + __dirname + '/index.html');
    windows.mainWindow.on('closed', function() {
        windows.mainWindow = null;
        app.quit();
    });

    windows.panelWindow = new BrowserWindow({
        width: 400,
        height: 200
    });
    windows.panelWindow.loadUrl('file://' + __dirname + '/panel.html');
    windows.panelWindow.openDevTools();
    windows.panelWindow.on('closed', function() {
        windows.panelWindow = null;
    });

    console.log(windows);

});
