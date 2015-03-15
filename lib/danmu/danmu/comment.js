module.exports = {
	init: function(DD) {
		/**
		 * 字幕对象，继承自Sprite对象
		 * @param param = {x, y, width, height, speed, text, lifeTime, color, font}
		 */
		DD.Comment = function(param) {

			DD.Sprite.call(this, param.x, param.y, param.width, param.height, param.speed);

			this.text = param.text || ""; //文字内容
			this.lifeTime = param.lifeTime || DD.config.display.comment.lifeTime;
			this.color = param.color || DD.config.display.comment.color;
			this.font = param.font || DD.config.display.comment.fontStyle;
			this.alive = true; //生命状态
		};

		DD.Comment.prototype = Object.create(DD.Sprite.prototype);
		/**
		 * 弹幕的绘制方法
		 */
		DD.Comment.prototype.draw = function(canvasContext) {
			//	canvasContext.save();//保存样式【每种弹幕都有自己的样式，为提高性能，注释掉ctx状态的保存和恢复】
			canvasContext.fillStyle = this.color;
			//设置阴影
			//	canvasContext.shadowColor = "#808080";
			//	canvasContext.shadowOffsetX = 1;
			//	canvasContext.shadowOffsetY = 1;
			//	canvasContext.shadowBlur = 1;
			canvasContext.font = this.font;
			canvasContext.fillText(this.text, this.x, this.y + this.height); //fillText(x,y)定位的锚点在字幕的左下角
			//	canvasContext.restore();//还原原有样式
		};

		/**
		 * 更新弹幕的生命状态
		 */
		DD.Comment.prototype.updateLifeTime = function() {
			this.lifeTime--; //每刷新一帧，存活时间-1
			this.alive = (this.lifeTime >= 0);
		};

	}
};