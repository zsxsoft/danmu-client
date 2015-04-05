module.exports = {
	init: function(DD) {
		/**
		 * 精灵对象,类似flash(ActionScript3.0)中的精灵.
		 * 所有的动画元素都必须继承自此对象,继承之后自动拥有move方法和速度属性.
		 * 每个动画元素都必须拥有一个自己的特殊的draw()方法的实现,这个方法用来在渲染每一帧的时候指定自己如何呈现在canvas帧画布上
		 * 注意这个所谓的"帧画布"不是指原生的canvas元素,而是指下面定义的一个Frame对象,此对象的意义就是一个帧,它负责把需要在这一帧上呈现的
		 * 图形画在canvas上,然后每一帧开始的时候都会清除上次画的,类似flash中的帧概念
		 * @param x 精灵相对与画布的位置
		 * @param y
		 * @param width 精灵的宽
		 * @param height
		 * @returns {Sprite}
		 */
		DD.Sprite = function(x, y, width, height, speed) {
			this.x = x || 0;
			this.y = y || 0;
			this.width = width || 0;
			this.height = height || 0;
			/**
			 * 精灵移动速度
			 */
			this.speed = speed || {
				x: 0,
				y: 0
			};
		};
		DD.Sprite.prototype = {
			constructor: DD.Sprite,

			/**
			 * 每个精灵都必须有自己的draw实现
			 */
			draw: function() {

			},

			/**
			 * 无需单独实现,通用的动画函数
			 */
			move: function() {
				this.x += this.speed.x;
				this.y += this.speed.y;
				if (typeof this.children !== "undefined") {
					for (var i = 0; i < this.children.length; i++) {
						this.children[i].speed = this.speed;
						this.children[i].move();
					}
				}
			},

			/**
			 * 向此精灵添加一个子精灵
			 */
			appendChild: function(sprite) {
				if (typeof this.children == "undefined") {
					this.children = [];
				}
				this.children.push(sprite);
			},

			/**
			 * 渲染子精灵
			 */
			drawChildren: function() {
				if (typeof this.children !== "undefined") {
					for (var i = 0; i < this.children.length; i++) {
						this.children[i].draw();
					}
				}
			}
		};
	}
};