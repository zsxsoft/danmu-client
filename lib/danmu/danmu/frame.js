/**
 * 帧对象
 * 原理就是每到一定时间就清除canvas，然后调用当前帧里的所有的元素的draw()方法。将所有动画元素按照新的配置重画，从而生成动画。
 * 之后程序无需关心元素的重画，只需要调整元素属性即可。
 */
function Frame(width, height, canvasContext) {
	/**
	 * 帧的宽和高
	 */
	this.width = width;
	this.height = height;
	/**
	 * 记录绘制Frame的定时器id
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
	/**
	 * 记录FPS
	 */
	this.fps = 0;
}


Frame.prototype.begin = function () {
	if (this.renderTimer !== null) return; //防止重复启动

	var that = this;
	(function animate() {
		that.updateSprite(); //更新Sprite
		that.clearSprite(); //清除无效Sprite
		that.render();
		that.fps = that.countFps(); // 计算FPS
		that.renderTimer = window.requestAnimationFrame(animate, that);

	})();
};
/** 
 * 计算FPS
 */
Frame.prototype.countFps = (function () {
	var lastLoop = (new Date()).getMilliseconds();
	var count = 1;
	var fps = 0;

	return function () {
		var currentLoop = (new Date()).getMilliseconds();
		if (lastLoop > currentLoop) {
			fps = count;
			count = 1;
		} else {
			count += 1;
		}
		lastLoop = currentLoop;
		return fps;
	};
})();
/**
 * 渲染本帧【可根据需要在子对象中复写此方法】
 */
Frame.prototype.render = function () {
	this.ctx.clearRect(0, 0, this.width, this.height);
	for (var i = 0; i < this.sprites.length; i++) {
		this.sprites[i].draw(this.ctx);
	}
};

/**
 * 停止动画
 */
Frame.prototype.stop = function () {
	if (this.renderTimer === null) return;
	window.cancelAnimationFrame(this.renderTimer);
	this.renderTimer = null;
};

/**
 * 添加精灵元素
 * @param sprite
 */
Frame.prototype.addSprite = function (sprite) {
	this.sprites.push(sprite);
};

/**
 * 更新本frame下所有Sprite的位置
 */
Frame.prototype.updateSprite = function () {
	this.sprites.forEach(function (sprite) {
		sprite.move();
	});
};

/**
 * 清除超出显示范围的精灵元素
 */
Frame.prototype.clearSprite = function () {
	this.sprites.forEach(function (sprite, index) {
		if (sprite.x > this.width || this.sprites[i].y > this.height ||
			sprite.x + sprite.width < 0 ||
			sprite.y + sprite.height < 0) {
			delete this.sprites[index]; //删除相应对象
			this.sprites = this.sprites.slice(0, i).concat(this.sprites.slice(i + 1, this.sprites.length)); //清除数组中该位置
		}
	});
};

module.exports = Frame;
