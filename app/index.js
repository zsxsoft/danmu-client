'use strict';
(() => {
  const electron = require('electron')
  const windows = electron.remote.getGlobal('windows')
  //    const coordinator = electron.remote.getGlobal('coordinator');
  const {shell} = electron
  const path = require('path')
  const fs = require('fs')
  const danmu = require('./lib/danmu')
  const listener = require('./lib/listener')

  const crypto = require('crypto')
  const packageJson = require('./package.json')
  let isStart = false

  let config = null
  try {
    config = eval(fs.readFileSync(path.resolve('config.js'), 'utf-8')) // eslint-disable-line no-eval
  } catch (e) {
    alert('你的config.js修改有误，解析出错：\n' + e.stack.toString())
    windows.mainWindow.openDevTools({detach: true})
    throw e
  }

  global.config = config

  function initFunction () {
    windows.mainWindow.setResizable(false) // Electron doesn't support both resizable and transparency
    windows.mainWindow.setIgnoreMouseEvents(true)

    document.getElementById('message').remove()
    document.querySelector('.border').remove()
    document.querySelector('body').style.background = 'transparent'

    listener.init(config)
    danmu.init(config, listener, document.getElementById('main-canvas'))

    isStart = true
  }

  function keydownFunction (e) {
    switch (e.keyCode) {
      case 13:
        if (!isStart) {
          initFunction()
          isStart = true
        }
        break
      case 116:
        e.preventDefault()
        break
      case 112:
        shell.openExternal(packageJson.homepage)
        break
      case 123:
        windows.mainWindow.webContents.openDevTools({detach: true})
        break
    }
  }

  document.getElementById('client-version').innerHTML = packageJson.version
  document.getElementById('client-homepage').innerHTML = packageJson.homepage
  document.getElementById('client-author').innerHTML = packageJson.author
  document.title = 'DANMU Client - Client ID = ' + crypto.createHash('md5').update(Math.random().toString()).digest('hex')
  window.addEventListener('keydown', keydownFunction, true)
})()
