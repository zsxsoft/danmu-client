/* global config */
var utils = require("../utils");
var Sprite = require('./sprite.js');
const DW_TEXT = 1;
const DW_IMAGE = 2;
/**
 * 字幕对象，继承自Sprite对象
 * @param param = {id, x, y, width, height, speed, text, lifeTime, color, font}
 */
function Comment(param) {

	Sprite.call(this, param.id, param.x, param.y, param.width, param.height, param.speed, param.lifeTime);
	this.text = param.text || ""; //文字内容
	this.color = param.color || config.display.comment.color;
	this.font = param.font || config.display.comment.fontStyle;

}

Comment.prototype = Object.create(Sprite.prototype);
/**
 * 缓存弹幕结果
 */
Comment.prototype.cache = null;
/**
 * 弹幕的绘制方法
 */
Comment.prototype.draw = function (canvasContext) {

	canvasContext.fillStyle = this.color;
	canvasContext.font = this.font;
	if (!config.display.image) {
		canvasContext.shadowOffsetX = 1;
		canvasContext.shadowOffsetY = 1;
		canvasContext.shadowBlur = 1;
		canvasContext.fillText(this.text, this.x, this.y + this.height);
		return;
	}

	// 以下为图文混排相关代码
	if (this.cache === null) {
		this.cache = [];
		var ret = null;
		var lastIndex = 0; // 记录未写入文字的起始点
		var nextPos = 0;
		var newTextArray = [];
		var spaceWidth = canvasContext.measureText(" ").width; // 得到字间距
		var that = this;
		utils.imageAnalyzer.regex = config.image.regex;

		utils.imageAnalyzer.test(function (ret, imageObject) {
			var text = that.text.substr(lastIndex, ret.index - lastIndex);
			that.cache.push({
				type: DW_TEXT,
				position: nextPos,
				text: text
			});
			nextPos += canvasContext.measureText(text).width + spaceWidth; // 计算此时图片位置
			that.cache.push({
				type: DW_IMAGE,
				object: imageObject,
				position: nextPos,
				width: imageObject.width
			});
			nextPos += imageObject.width + spaceWidth;
			lastIndex = ret.index + ret[0].length; // 更新未写入文字的起始点

		}, this.text);
		that.cache.push({
			type: DW_TEXT,
			position: nextPos,
			text: this.text.substr(lastIndex, this.text.length)
		});
	}

	var x = this.x;
	var y = this.y;
	var height = this.height;
	var actualHeight = y + height;
	this.cache.forEach(function (val) {
		switch (val.type) {
		case DW_TEXT:
			canvasContext.shadowOffsetX = 1;
			canvasContext.shadowOffsetY = 1;
			canvasContext.shadowBlur = 1;
			canvasContext.fillText(val.text, x + val.position, actualHeight);
			break;
		case DW_IMAGE:
			if (val.object.error) return; // 出错
			canvasContext.shadowBlur = 0;
			canvasContext.shadowOffsetX = 0;
			canvasContext.shadowOffsetY = 0;
			if (val.object.loaded) {
				canvasContext.drawImage(val.object.element, x + val.position, y + height / 10 + 1, val.width, height); // 绘制图片
				// 10+1是一个修正偏移的魔法数字
				val.object.loaded = true;
			} else {
				try {
					// try-catch杀性能
					// see: https://cnodejs.org/topic/5344c3163c43b1ae59002ea2
					canvasContext.drawImage(val.object.element, x + val.position, y + height / 10 + 1, val.width, height); // 绘制图片
				} catch (e) {
					val.object.error = true;
				}
			}

			break;
		}
	});

};

/**
 * 更新弹幕的生命状态
 */
Comment.prototype.updateLifeTime = function () {
	this.lifeTime--; //每刷新一帧，存活时间-1
	this.alive = (this.lifeTime >= 0);
};


module.exports = Comment;