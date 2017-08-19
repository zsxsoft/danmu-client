(function () {
  const electron = require('electron')
  const windows = electron.remote.getGlobal('windows')
  const coordinator = electron.remote.getGlobal('coordinator')
  const controlButtons = Array.from(window.document.querySelectorAll('.btn-control')) // I think querySelectorAll's api is terrible.
  let countQuitValue = 0
  let isShow = true

  function controlButtonClick () {
    coordinator.emit(this.getAttribute('data-top'), this.getAttribute('data-param'))
  }

  coordinator.on('fps', fps => {
    if (!isShow) return
    document.title = 'FPS: ' + fps
  })

  window.addEventListener('beforeunload', e => {
    // Hide but not exit
    // We cannot call a function that in a unregistered window.
    e.returnValue = 'false'
    windows.panelWindow.hide()
    isShow = false
  })

  window.addEventListener('keydown', e => {
    if (e.keyCode === 123) { // F12
      windows.panelWindow.webContents.openDevTools({
        detach: true
      })
    }
  }, true)

  document.querySelector('#btn-quit').addEventListener('click', () => {
    if (countQuitValue === 1) {
      coordinator.emit('exit')
    } else {
      setTimeout(() => {
        document.querySelector('#btn-quit').innerText = '退出程序'
        countQuitValue = 0
      }, 5000)
      this.innerText = '再按一次'
      countQuitValue = 1
    }
    return false
  })

  controlButtons.forEach(item => {
    item.addEventListener('click', controlButtonClick)
  })

  require('windows-caption-color').get((err, ret) => {
    if (!err) {
      window.document.body.style.background = 'rgba(' + ret.reg.r + ', ' + ret.reg.g + ', ' + ret.reg.b + ', ' + ret.reg.a + ')'
    }
  })
})()
