'use strict'

/**
 * 精灵对象
 * 所有的动画元素都必须继承自此对象,继承之后自动拥有move方法、速度属性、删除自身方法.
 * 每个动画元素都必须拥有一个自己的特殊的draw()方法的实现,这个方法用来在渲染每一帧的时候指定自己如何呈现在每一帧（frame.js）上
 * @param id
 * @param x 精灵相对与画布的位置
 * @param y
 * @param width 精灵的宽
 * @param height
 * @param speed
 * @param lifeTime
 * @param alive
 * @returns {Sprite}
 */
class Sprite {
  constructor (id, x, y, width, height, speed, lifeTime, alive) {
    this.id = id || 0
    this.x = x || 0
    this.y = y || 0
    this.width = width || 0
    this.height = height || 0
    this.lifeTime = lifeTime || 0
    this.alive = alive || true
    this.children = []
    /**
         * 精灵移动速度
         */
    this.speed = speed || {
      x: 0,
      y: 0
    }
  }

  draw () {

  }

  move () {
    this.x += this.speed.x
    this.y += this.speed.y
    if (typeof this.children !== 'undefined') {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].speed = this.speed
        this.children[i].move()
      }
    }
  }
  /**
         * 向此精灵添加一个子精灵
         */
  appendChild (sprite) {
    this.children.push(sprite)
  }
  /**
         * 渲染子精灵
         */
  drawChildren () {
    this.children.forEach(function (child) {
      child.draw()
    })
  }

  /**
     * 删除自身
     */
  remove () {
    this.lifeTime = 0
    this.alive = false
  };
}

module.exports = Sprite
