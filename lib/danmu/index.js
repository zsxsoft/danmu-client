'use strict'

const coordinator = require('electron').remote.getGlobal('coordinator')
const Player = require('./player')
const player = new Player()

// 监听得到弹幕的事件
coordinator.on('gotDanmu', data => {
  player.parseDanmus(data)
  player.controlDanmu('update')
})
// 监听操作相关事件
coordinator.on('danmuControl', data => {
  window.danmuControl[data].call()
})
// 删除弹幕事件
coordinator.on('deleteDanmu', data => {
  player.deleteDanmus(data.ids)
})

function send (param) {
  player.parseDanmus([param])
  player.controlDanmu('update')
};

function init (config, listener, object) {
  if (config.image.preload) {
    config.image.whitelist.map(url => {
      let img = window.document.createElement('img')
      img.width = 0
      img.height = 0
      img.src = url
      window.document.body.appendChild(img)
    })
  }
  player.setup(object, 'canvas-danmu')
  player.controlDanmu('play')
  window.setInterval(function () {
    coordinator.emit('fps', player.frame.fps)
  }, 1000)
  window.console.log('弹幕初始化完成！')
};

module.exports = {
  init: init,
  send: send,
  example: function () {
    let i = 1
    let id = 10000
    setInterval(function () {
      send({
        text: '[IMG WIDTH=24]danmu-24.png[/IMG]测试[IMG WIDTH=24]danmu-24.png[/IMG]Hello World[IMG WIDTH=24]danmu-24.png[/IMG]',
        color: 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')',
        lifeTime: 500,
        textStyle: 'normal bold ' + i + 'em 微软雅黑',
        height: i * 10,
        id: id
      })
      i++
      if (i > 5) i = 1
    }, 10)
  },
  stop: function () {
    player.frame.stopDanmu()
  },
  start: function () {
    player.frame.restartDanmu()
  },
  clear: function () {
    player.frame.clearDanmu()
  }
}

// 给window添加私货方便调试
window.danmuControl = module.exports
