'use strict'

/**
 * 帧对象
 * 原理就是每到一定时间就清除canvas，然后调用当前帧里的所有的元素的draw()方法。将所有动画元素按照新的配置重画，从而生成动画。
 * 之后程序无需关心元素的重画，只需要调整元素属性即可。
 */
class Frame {
  constructor (width, height, canvasContext) {
    /**
     * 帧的宽和高
     */
    this.width = width
    this.height = height
    /**
     * 记录绘制Frame的定时器id
     */
    this.renderTimer = null
    /**
     * 本帧所要绘制的精灵元素
     */
    this.sprites = []
    /**
     * 保存本帧相关的canvas标签的context
     */
    this.ctx = canvasContext
    /**
     * 记录FPS
     */
    this.fps = 0
  }

  begin () {
    if (this.renderTimer !== null) {
      return // 防止重复启动
    }

    let that = this;
    (function animate () {
      that.updateSprite() // 更新Sprite
      that.clearSprite() // 清除无效Sprite
      that.render()
      that.fps = that.countFps() // 计算FPS
      that.renderTimer = window.requestAnimationFrame(animate, that)
    })()
  };

  /**
     * 渲染本帧【可根据需要在子对象中复写此方法】
     */
  render () {
    this.ctx.clearRect(0, 0, this.width, this.height)
    for (let i = 0; i < this.sprites.length; i++) {
      this.sprites[i].draw(this.ctx)
    }
  };

  /**
     * 停止动画
     */
  stop () {
    if (this.renderTimer === null) {
      return
    }
    window.cancelAnimationFrame(this.renderTimer)
    this.renderTimer = null
  };

  /**
     * 添加精灵元素
     * @param sprite
     */
  addSprite (sprite) {
    this.sprites.push(sprite)
  };
  /**
     * 删除精灵元素
     * @param sprite
     */
  deleteSprites (indexs) {
    let that = this
    indexs.forEach(function (index) {
      if (that.sprites[index]) {
        that.sprites[index].remove()
        that.sprites.splice(index, 1)
      }
    })
  };

  /**
     * 更新本frame下所有Sprite的位置
     */
  updateSprite () {
    this.sprites.forEach(sprite => {
      sprite.move()
    })
  };

  /**
     * 清除超出显示范围的精灵元素
     */
  clearSprite () {
    this.sprites.forEach((sprite, index) => {
      if (sprite.x > this.width || this.sprites[index].y > this.height ||
                sprite.x + sprite.width < 0 ||
                sprite.y + sprite.height < 0) {
        delete this.sprites[index] // 删除相应对象
        this.sprites = this.sprites.slice(0, index).concat(this.sprites.slice(index + 1, this.sprites.length)) // 清除数组中该位置
      }
    })
  };
}
/**
 * 计算FPS
 */
Frame.prototype.countFps = (function () {
  let lastLoop = (new Date()).getMilliseconds()
  let count = 1
  let fps = 0

  return function () {
    let currentLoop = (new Date()).getMilliseconds()
    if (lastLoop > currentLoop) {
      fps = count
      count = 1
    } else {
      count += 1
    }
    lastLoop = currentLoop
    return fps
  }
})()
module.exports = Frame
