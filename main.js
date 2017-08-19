const electron = require('electron')
const path = require('path')
const {app, BrowserWindow} = electron
global.coordinator = new (require('events').EventEmitter)()
global.windows = {}

coordinator.on('exit', () => {
  app.exit(0)
})
app.on('window-all-closed', () => {
  app.exit(0)
})

app.on('ready', () => {
  windows.panelWindow = new BrowserWindow({
    width: 390,
    height: 150,
    resizable: false,
    icon: `${__dirname}/danmu.png`
  })
  windows.panelWindow.loadURL(`file://${__dirname}/panel.html`)
  windows.panelWindow.on('closed', () => {
    // app.exit();
  })
  windows.panelWindow.setMenu(null)

  windows.mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    toolbar: false,
    resizable: true,
    title: 'DANMU Client',
    alwaysOnTop: true,
    icon: path.join(__dirname, '/danmu.png')
  })
  windows.mainWindow.loadURL(`file://${__dirname}/index.html`)
  windows.mainWindow.on('closed', () => {
    coordinator.emit('exit')
  })
  windows.mainWindow.setMenu(null)
})
