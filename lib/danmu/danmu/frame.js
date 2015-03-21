	module.exports = {
		init: function(DD) {

			/**
			 * 帧对象,每隔一段时间重画自己一次,类似flash中的帧概念
			 * 原理就是每到一定时间就清除canvas,然后调用当前帧里的所有的动画元素的draw()方法,将所有动画元素按照新的配置重画
			 * 从而生成动画,之后程序无需关心元素的重画,只需要调整元素属性即可,这个对象会自动管理元素的渲染
			 */
			DD.Frame = function(width, height, canvasContext) {
				/**
				 * 帧的宽和高
				 */
				this.width = width;
				this.height = height;
				/**
				 * 记录绘制frame的定时器id
				 */
				this.renderTimer = null;
				/**
				 * 本帧所要绘制的精灵元素
				 */
				this.sprites = [];
				/**
				 * 保存本帧相关的canvas标签的context
				 */
				this.ctx = canvasContext;
			};
			DD.Frame.prototype = {
				constructor: DD.Frame,

				/**
				 * 开始动画
				 */
				begin: function() {
					if (this.renderTimer != null) return; //防止重复启动

					//使用html5新增的requestAnimFrame API
					var that = this;
					(function animate() {
						that.updateSprite(); //更新Sprite
						that.clearSprite(); //清除无效Sprite
						that.render();
						that.renderTimer = window.requestAnimationFrame(animate, that);
					})();
				},

				/**
				 * 渲染本帧【可根据需要在子对象中复写此方法】
				 */
				render: function() {
					this.ctx.clearRect(0, 0, this.width, this.height);
					for (var i = 0; i < this.sprites.length; i++) {
						this.sprites[i].draw(this.ctx);
					}
				},

				/**
				 * 停止动画
				 */
				stop: function() {
					if (this.renderTimer == null) return;
					window.cancelAnimationFrame(this.renderTimer);
					this.renderTimer = null;
				},

				/**
				 * 添加精灵元素
				 * @param sprite
				 */
				addSprite: function(sprite) {
					this.sprites.push(sprite);
				},

				/**
				 * 更新本frame下所有Sprite的位置【可根据需要在子对象中复写此方法】
				 */
				updateSprite: function() {
					for (var i = 0; i < this.sprites.length; i++) {
						this.sprites[i].move();
					}
				},

				/**
				 * 清除超出显示范围的精灵元素【可根据需要在子对象中复写此方法】
				 */
				clearSprite: function() {
					for (var i = 0; i < this.sprites.length; i++) {
						if (this.sprites[i].x > this.width || this.sprites[i].y > this.height ||
							this.sprites[i].x + this.sprites[i].width < 0 ||
							this.sprites[i].y + this.sprites[i].height < 0) {
							delete this.sprites[i]; //删除相应对象
							this.sprites = this.sprites.slice(0, i).concat(this.sprites.slice(i + 1, this.sprites.length)); //清除数组中该位置
						}
					}
				}
			};

		}
	};