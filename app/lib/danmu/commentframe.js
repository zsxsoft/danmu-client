/* global config */
'use strict'
let Frame = require('./frame')
let Comment = require('./comment')

/**
 * 弹幕frame对象，继承字Frame对象
 * @param width
 * @param height
 * @param canvasContext
 * @returns
 */
class CommentFrame extends Frame {
  constructor (width, height, canvasContext) {
    super(width, height, canvasContext)

    /**
         * 标志本帧所绘制的弹幕是可见还是隐藏
         */
    this.visible = true
    /**
         * 保存需要绘制的多层弹幕
         */
    this.layers = []
    /**
         * 弹幕ID所对应的弹幕层
         */
    this.idMap = {}
    /**
         * 创建缓冲画布
         */
    this.bufCanvas = window.document.createElement('canvas')
    this.bufCanvas.width = width
    this.bufCanvas.height = height
    /**
         * 标识是否打开弹幕
         */
    this.danmuState = true
  }

  /**
     * 重设置本frame的宽和高，同时bufCanvas尺寸也随之修改
     * @param width
     * @param height
     */
  resize (width, height) {
    this.width = width
    this.height = height

    this.bufCanvas.width = width
    this.bufCanvas.height = height
  };

  /**
     * @Override
     * 向Frame中添加弹幕对象.
     * 在本Frame中根据生成弹幕Sprite.这样当播放器进度seek的时候，重新根据弹幕信息重新new的Sprite对象的x位置是对的；
     * 如果在Playr中new好了，再根据时间add进来，当播放器往回seek的时候，加进来的是已存在的对象，这时对象的x可能是已经超出显示范围的负数了，不会被再次显示。
     */
  addSprite (info) {
    if (!this.danmuState) return

    let that = this

    let style = info.style || config.display.comment.animationStyle
    let color = info.color || config.display.comment.fontColor
    let font = info.font || config.display.comment.fontStyle
    let lifeTime = info.lifeTime || config.display.comment.lifeTime
    let height = info.height || config.display.comment.height
    let text = info.text

    // 文字的宽度【注意，ctx.measureText(text).width得到文字宽度是基于ctx当前的font的，如果取得width后改变了ctx.font很可能width与实际文字宽度不匹配】
    this.bufCanvas.getContext('2d').font = font
    let width = this.bufCanvas.getContext('2d').measureText(text).width

    let result = generateY(style, height, 0) // 计算弹幕位置，从第0层弹幕开始
    let y = result.y
    let index = result.index

    let x = generateX(style, width)

    this.layers[index].push(new Comment({
      x: x,
      y: y,
      width: width,
      height: height,
      speed: generateSpeed(style, x, y, lifeTime),
      text: text,
      lifeTime: lifeTime,
      color: color,
      font: font,
      id: info.id
    }))
    this.idMap[info.id] = {
      layer: index,
      index: this.layers[index].length - 1
    }

    /**
         * 确定弹幕的速度
         * @param style 弹幕类型
         * @returns speed{}
         */
    function generateSpeed (style, x, y, lifeTime) {
      if (style === 'scroll') {
        return {
          x: -(x + width) / lifeTime, // -(移动距离+文本宽度)/(移动时间*帧数)
          y: 0
        }
      } else if (style === 'reversescroll') {
        return {
          x: (width + that.width) / lifeTime,
          y: 0
        }
      } else if (style === 'staticdown' || style === 'staticup') {
        return {
          x: 0,
          y: 0
        }
      }
      // 这里一大串if和elseif实在是不够优雅
      // 不过目前就这四个的话懒得再去抽象成接口
      // 这里用桥接模式的话应该很合适呢
    }

    /**
         * 确定弹幕的X坐标
         * @param style 弹幕类型
         * @param textWidth 该弹幕的文字内容宽度
         * @returns x
         */
    function generateX (style, textWidth) {
      if (style === 'scroll') {
        return that.width
      } else if (style === 'reversescroll') {
        return 0
      } else if (style === 'staticdown' || style === 'staticup') {
        return (that.width - textWidth) / 2
      }
    }

    /**
         * 检查是否与当前Frame中其他弹幕重叠
         * @param y 本弹幕y坐标
         * @param size 本弹幕高度
         * @param index 当前排序所在的弹幕层
         * @returns {Boolean} true表示有重叠
         */
    function checkDanmu (y, size, index) {
      let currentLayerDanmus = that.layers[index] // 取得当前弹幕层的所有danmus
      for (let i = 0; i < currentLayerDanmus.length; i++) {
        let danmu = currentLayerDanmus[i]
        if (y + size > danmu.y && y < danmu.y + danmu.height) { // 如果有重叠
          return true
        }
      }
      return false // 没有重叠
    }
    /**
         * 确定弹幕的y坐标
         * @param style 弹幕类型
         * @param size 该弹幕的高(字号)
         * @param index 当前排序所在的弹幕层
         * @returns {} {'y坐标':y,'所在弹幕层号index':index}
         */
    function generateY (style, size, index) {
      if (index > 20) {
        return {
          'y': 0,
          'index': index - 1
        }
      } // 超过20层就不显示了

      while (!that.layers[index]) { // 如果当前弹幕层还不存在
        // 增加弹幕层
        that.layers.push([])
      }

      let y = 0
      if (style === 'scroll' || style === 'reversescroll') { // 滚动字幕尽量向顶部聚集,但不重叠
        while (y < that.height - size) {
          if (checkDanmu(y, size, index)) {
            y++
          } else { // 找到合适位置
            return {
              'y': y,
              'index': index
            }
          }
        }
      } else if (style === 'staticdown') { // 底部字幕尽量向底部聚集,但不重叠
        y = that.height - height - 8 // 从底部-文字高度-底部边距的位置开始往上排，默认底部边距是8.
        while (y > 0) {
          if (checkDanmu(y, size, index)) {
            y--
          } else { // 找到合适位置
            return {
              'y': y,
              'index': index
            }
          }
        }
      } else if (style === 'staticup') {
        y = 0 + height + 8 // 注释参见staticdown
        while (y > 0) {
          if (checkDanmu(y, size, index)) {
            y++
          } else { // 找到合适位置
            return {
              'y': y,
              'index': index
            }
          }
        }
      }

      // 没有合适位置，再次调用本方法
      return generateY(style, size, index + 1)
    }
  };

  /**
     * 向Frame中添加自定义弹幕对象.默认渲染在现有层的最后一层即最上层.
     * @param className 自定义弹幕类
     */
  addCustomSprite (info) {
    if (!this.danmuState) return

    let script = window.document.createElement('script')
    let className = 'danmuClass__' + new Date().getTime().toString() + '_' + Math.floor((Math.random() * 100000)).toString()
    let sourceCode = 'var ' + className + ' = ((function() { ' + info.sourceCode + '})()); '
    script.innerHTML = sourceCode
    window.document.head.appendChild(script)
    let customSprite = new (window[className])(info)

    // 高度、宽度等不受系统管理
    while (!this.layers[this.layers.length - 1]) { // 如果当前弹幕层还不存在
      this.layers.push([]) // 增加弹幕层
    }
    let layer = this.layers.length - 1
    this.layers[layer].push(customSprite)
    this.idMap[info.id] = {
      layer: layer,
      index: this.layers[layer].length - 1
    }
  };

  /**
     * @Override
     * 对本帧进行分层渲染
     */
  render () {
    let bufCanvasCtx = this.bufCanvas.getContext('2d')
    this.ctx.clearRect(0, 0, this.width, this.height) // 清空结果画布
    bufCanvasCtx.clearRect(0, 0, this.width, this.height) // 清空buffer画布
    // 渲染各层精灵到buffer画布上
    for (let i = 0; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].length; j++) {
        this.layers[i][j].draw(bufCanvasCtx)
      }
    }
    // 往主图层上绘制buffer图层
    this.ctx.drawImage(this.bufCanvas, 0, 0)
  };

  /**
     * 如果播放器seek了，清空所有弹幕
     */
  clearDanmu () {
    for (let i = 0; i < this.layers.length; i++) {
      delete this.layers[i] // 删除相应对象
    }
    Object.keys(this.idMap, key => delete this.idMap[key])
    this.idMap = {}
    this.layers = []
  };

  /**
     * 停止显示弹幕，停止创建弹幕
     */
  stopDanmu () {
    this.clearDanmu()
    this.danmuState = false
  };

  /**
     * 重新打开弹幕功能
     */
  restartDanmu () {
    this.danmuState = true
  };
  /**
     * @Override
     * 更新CommentFrame中弹幕Sprite的状态
     */
  updateSprite () {
    for (let i = 0; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].length; j++) {
        // 更新位置
        this.layers[i][j].move()
        // 更新生命状态
        this.layers[i][j].updateLifeTime()
      }
    }
  };
  /**
     * @Override
     * 清除已经死亡的Sprite
     */
  clearSprite () {
    for (let i = 0; i < this.layers.length; i++) {
      for (let j = 0; j < this.layers[i].length; j++) {
        if (!this.layers[i][j].alive) {
          delete this.idMap[this.layers[i][j].id]
          delete this.layers[i][j] // 删除相应对象
          this.layers[i] = this.layers[i].slice(0, j).concat(this.layers[i].slice(j + 1, this.layers[i].length)) // 清除数组中该位置
          for (let l = j; l < this.layers[i].length; l++) {
            this.idMap[this.layers[i][l].id].index--
          }
        }
      }
    }
  };

  /**
     * @Override
     * 删除精灵元素
     * @param sprite
     */
  deleteSprites (indexs) {
    indexs.forEach(index => {
      if (this.idMap[index]) {
        if (this.layers[this.idMap[index].layer]) {
          if (this.layers[this.idMap[index].layer][this.idMap[index].index]) {
            this.layers[this.idMap[index].layer][this.idMap[index].index].remove()
          }
        }
      }
    })
  };
}
module.exports = CommentFrame
