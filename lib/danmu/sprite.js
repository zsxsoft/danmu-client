/**
 * 精灵对象
 * 所有的动画元素都必须继承自此对象,继承之后自动拥有move方法和速度属性.
 * 每个动画元素都必须拥有一个自己的特殊的draw()方法的实现,这个方法用来在渲染每一帧的时候指定自己如何呈现在每一帧（frame.js）上
 * @param x 精灵相对与画布的位置
 * @param y
 * @param width 精灵的宽
 * @param height
 * @returns {Sprite}
 */
function Sprite(x, y, width, height, speed) {
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	this.children = [];
	/**
	 * 精灵移动速度
	 */
	this.speed = speed || {
		x: 0,
		y: 0
	};
}
/**
 * 每个精灵都必须有自己的draw实现
 */
Sprite.prototype.draw = function () {

};

/**
 * 移动
 */
Sprite.prototype.move = function () {
	this.x += this.speed.x;
	this.y += this.speed.y;
	if (typeof this.children !== "undefined") {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].speed = this.speed;
			this.children[i].move();
		}
	}
};

/**
 * 向此精灵添加一个子精灵
 */
Sprite.prototype.appendChild = function (sprite) {
	this.children.push(sprite);
};

/**
 * 渲染子精灵
 */
Sprite.prototype.drawChildren = function () {
	this.children.forEach(function(child) {
		child.draw();
	});
};

module.exports = Sprite;