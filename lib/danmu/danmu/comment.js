module.exports = {
	init: function(DD) {
		const DW_TEXT = 1;
		const DW_IMAGE = 2;
		/**
		 * 字幕对象，继承自Sprite对象
		 * @param param = {x, y, width, height, speed, text, lifeTime, color, font}
		 */
		DD.Comment = function(param) {

			DD.Sprite.call(this, param.x, param.y, param.width, param.height, param.speed);
			this.text = param.text || ""; //文字内容
			this.lifeTime = param.lifeTime || config.display.comment.lifeTime;
			this.color = param.color || config.display.comment.color;
			this.font = param.font || config.display.comment.fontStyle;
			this.alive = true; //生命状态
		};

		DD.Comment.prototype = Object.create(DD.Sprite.prototype);
		/**
		 * 弹幕的绘制方法
		 */
		var imageCache = {}; // 图像DOM缓存

		DD.Comment.prototype.cache = null;
		DD.Comment.prototype.draw = function(canvasContext) {
			//	canvasContext.save();//保存样式【每种弹幕都有自己的样式，为提高性能，注释掉ctx状态的保存和恢复】
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
				var regex = config.image.regex;
				regex.lastIndex = 0;
				var ret = null;
				var lastIndex = 0;  // 记录未写入文字的起始点
				var nextPos = 0;
				var newTextArray = [];
				var spaceWidth = canvasContext.measureText(" ").width; // 得到字间距
				while ((ret = regex.exec(this.text)) !== null) {
					var src = ret[2];
					var imageWidth = parseInt(ret[1]);
					var image = imageCache[src];
					if (!image) {
						image = window.document.createElement("img");
						image.src = src;
						image.width = imageWidth;
						image.onerror = function() {
							window.console.error("Cannot load " + src);
							imageCache[src].error = true;
						}
						imageCache[src] = {
							error: false,
							element: image
						};
					}
					// 先计算图形宽度，大概判断要多少个空格
					var text = this.text.substr(lastIndex, ret.index - lastIndex);
					this.cache.push({
						type: DW_TEXT,
						position: nextPos, 
						text: text
					});
					nextPos += canvasContext.measureText(text).width + spaceWidth; // 计算此时图片位置
					this.cache.push({
						type: DW_IMAGE,
						object: image, 
						position: nextPos, 
						width: imageWidth
					});
					nextPos += imageWidth + spaceWidth;
				 	lastIndex = ret.index + ret[0].length; // 更新未写入文字的起始点
				}
				this.cache.push({
					type: DW_TEXT,
					position: nextPos, 
					text: this.text.substr(lastIndex, this.text.length)
				});
				regex.lastIndex = 0;
			}
			var x = this.x;
			var y = this.y;
			var height = this.height;
			var actualHeight = y + height;
			this.cache.map(function(val) {
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

		// 低性能代码
		/*
		DD.Comment.prototype.drawCache = {
			init: false,
			text: "",
			image: []
		};
		DD.Comment.prototype.draw3 = function(canvasContext) {
			//	canvasContext.save();//保存样式【每种弹幕都有自己的样式，为提高性能，注释掉ctx状态的保存和恢复】
			canvasContext.fillStyle = this.color;
			//设置阴影
			canvasContext.shadowColor = "#808080";
			canvasContext.shadowOffsetX = 1;
			canvasContext.shadowOffsetY = 1;
			canvasContext.shadowBlur = 1;
			canvasContext.font = this.font;
			if (!this.drawCache.init) {
				var regex = /<img src="(.+?)" width="(.+?)">/g;
				var ret = null;
				var lastIndex = 0;  // 记录未写入文字的起始点
				var nextPos = 0;
				var newTextArray = [];
				var spaceWidth = canvasContext.measureText(" ").width; // 得到字间距
				window.console.log(canvasContext.measureText(" "));
				while ((ret = regex.exec(this.text)) != null) {
					var src = ret[1];
					var imageWidth = parseInt(ret[2]);
					var image = imageCache[src];
					if (!image) {
						image = window.document.createElement("img");
						image.src = src;
						image.width = ret[2];
						imageCache[src] = image;
					}
					// 先计算图形宽度，大概判断要多少个空格
					var spaceCount = Math.round(imageWidth / spaceWidth) + 1;
					var text = this.text.substr(lastIndex, ret.index - lastIndex);
					newTextArray.push(text); // 置入图片前的内容
					newTextArray.push(new Array(spaceCount + 2).join(" ")); // 往文本内填入空格
					nextPos += canvasContext.measureText(text).width + spaceWidth; // 计算此时图片位置
					this.drawCache.image.push({
						element: image, 
						position: nextPos, 
						width: imageWidth
					});
					nextPos += imageWidth + spaceWidth;
				 	lastIndex = ret.index + ret[0].length; // 更新未写入文字的起始点
				}
				newTextArray.push(this.text.substr(lastIndex, this.text.length));
				this.drawCache.text = newTextArray.join("");
				this.drawCache.init = true;
			}
			var x = this.x;
			var y = this.y;
			var height = this.height;
			var actualHeight = y + height;
			canvasContext.fillText(this.drawCache.text, x, actualHeight);
			if (this.drawCache.image.length > 0) {
				canvasContext.shadowBlur = 0;
				canvasContext.shadowOffsetX = 0;
				canvasContext.shadowOffsetY = 0;
				this.drawCache.image.map(function(val) {
					canvasContext.drawImage(val.element, x + val.position, y, val.width, height); // 绘制图片
				});
			}

			
		};*/

		/**
		 * 更新弹幕的生命状态
		 */
		DD.Comment.prototype.updateLifeTime = function() {
			this.lifeTime--; //每刷新一帧，存活时间-1
			this.alive = (this.lifeTime >= 0);
		};

	}
};