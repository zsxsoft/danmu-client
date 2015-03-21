module.exports = {
	init: function(DD) {
		/**
		 * 弹幕frame对象，继承字Frame对象
		 * @param width
		 * @param height
		 * @param canvasContext
		 * @returns
		 */
		DD.CommentFrame = function(width, height, canvasContext) {
			DD.Frame.call(this, width, height, canvasContext);

			/**
			 * 标志本帧所绘制的弹幕是可见还是隐藏
			 */
			this.visible = true;
			/**
			 * 保存需要绘制的多层弹幕
			 */
			this.layers = [];
			/**
			 * 创建缓冲画布
			 */
			this.bufCanvas = window.document.createElement("canvas");
			this.bufCanvas.width = width;
			this.bufCanvas.height = height;

		};
		DD.CommentFrame.prototype = Object.create(DD.Frame.prototype);

		/**
		 * 重设置本frame的宽和高，同时bufCanvas尺寸也随之修改
		 * @param width
		 * @param height
		 */
		DD.CommentFrame.prototype.resize = function(width, height) {
			this.width = width;
			this.height = height;

			this.bufCanvas.width = width;
			this.bufCanvas.height = height;
		};

		/**
		 * @Override
		 * 向Frame中添加弹幕对象.
		 * 在本Frame中根据生成弹幕Sprite.这样当播放器进度seek的时候，重新根据弹幕信息重新new的Sprite对象的x位置是对的；
		 * 如果在Playr中new好了，再根据时间add进来，当播放器往回seek的时候，加进来的是已存在的对象，这时对象的x可能是已经超出显示范围的负数了，不会被再次显示。
		 */
		DD.CommentFrame.prototype.addSprite = function(config, text, style, color, font, lifeTime) {
			var that = this;

			style = style || config.display.comment.animationStyle;
			color = color || config.display.comment.fontColor;
			font = font || config.display.comment.fontStyle;
			lifeTime = lifeTime || config.display.comment.lifeTime;

			//文字的宽度【注意，ctx.measureText(text).width得到文字宽度是基于ctx当前的font的，如果取得width后改变了ctx.font很可能width与实际文字宽度不匹配】
			this.bufCanvas.getContext("2d").font = font;
			var width = this.bufCanvas.getContext("2d").measureText(text).width;
			var height = config.display.comment.height;
			var result = generateY(style, height, 0); //计算弹幕位置，从第0层弹幕开始
			var y = result.y;
			var index = result.index;

			var x = generateX(style, width);

			this.layers[index].push(new DD.Comment({
				x: x,
				y: y,
				width: width,
				height: height,
				speed: generateSpeed(style, x, y, lifeTime),
				text: text,
				lifeTime: lifeTime,
				color: color,
				font: font
			}));

			/**
			 * 确定弹幕的速度
			 * @param style 弹幕类型
			 * @returns speed{}
			 */
			function generateSpeed(style, x, y, lifeTime) {
				if (style == "Scroll") {
					return {
						x: -(x + width) / lifeTime, //-(移动距离+文本宽度)/(移动时间*帧数)
						y: 0
					};
				} else if (style == "Static") {
					return {
						x: 0,
						y: 0
					};
				}
			}

			/**
			 * 确定弹幕的X坐标
			 * @param style 弹幕类型
			 * @param textWidth 该弹幕的文字内容宽度
			 * @returns x
			 */
			function generateX(style, textWidth) {
				if (style == "Scroll") {
					return that.width;
				} else if (style == "Static") {
					return (that.width - textWidth) / 2;
				}
			}

			/**
			 * 检查是否与当前Frame中其他弹幕重叠
			 * @param y 本弹幕y坐标
			 * @param size 本弹幕高度
			 * @param index 当前排序所在的弹幕层
			 * @returns {Boolean} true表示有重叠
			 */
			function checkDanmu(y, size, index) {
				var currentLayerDanmus = that.layers[index]; //取得当前弹幕层的所有danmus
				for (var i = 0; i < currentLayerDanmus.length; i++) {
					var danmu = currentLayerDanmus[i];
					if (y + size > danmu.y && y < danmu.y + danmu.height) { //如果有重叠
						return true;
					}
				}
				return false; //没有重叠
			}
			/**
			 * 确定弹幕的y坐标
			 * @param style 弹幕类型
			 * @param size 该弹幕的高(字号)
			 * @param index 当前排序所在的弹幕层
			 * @returns {} {'y坐标':y,'所在弹幕层号index':index}
			 */
			function generateY(style, size, index) {
				if (index > 20) return {
					'y': 0,
					'index': index - 1
				}; //超过20层就不显示了

				while (typeof that.layers[index] == "undefined") { //如果当前弹幕层还不存在
					//增加弹幕层
					that.layers.push([]);
				}

				var y = 0;
				if (style == "Scroll") { //滚动字幕尽量向顶部聚集,但不重叠
					while (y < that.height - size) {
						if (checkDanmu(y, size, index)) {
							y++;
						} else { //找到合适位置
							return {
								'y': y,
								'index': index
							};
						}
					}
				} else if (style == "Static") { //底部字幕尽量向底部聚集,但不重叠
					y = that.height - height - 8; //从底部-文字高度-底部边距的位置开始往上排，默认底部边距是8.
					while (y > 0) {
						if (checkDanmu(y, size, index)) {
							y--;
						} else { //找到合适位置
							return {
								'y': y,
								'index': index
							};
						}
					}
				}
				//没有合适位置，再次调用本方法
				return generateY(style, size, index + 1);
			}
		};

		/**
		 * 向Frame中添加自定义弹幕对象.默认渲染在现有层的最后一层即最上层.
		 * @param [string]clazz 自定义弹幕类
		 * @param [string]param 初始化参数,至少要给lifeTime.eg: "{'lifeTime':4*60}"
		 */
		DD.CommentFrame.prototype.addCustomSprite = function(config, clazz, param) {
			eval(clazz);
			param = eval('(' + param + ')'); //eval(s),如果s语句执行结果是一个值,则返回此值,否则返回undefined.对象声明语法“{}”并不能返回一个值,需要用括号括起来将其转换为表达式，才能返回其值，
			var customSprite = new CustomComment(param);

			while (typeof this.layers[this.layers.length - 1] == "undefined") { //如果当前弹幕层还不存在	
				this.layers.push([]); //增加弹幕层
			}
			this.layers[this.layers.length - 1].push(customSprite);
		};

		/**
		 * @Override
		 * 对本帧进行分层渲染
		 */
		DD.CommentFrame.prototype.render = function() {
			this.ctx.clearRect(0, 0, this.width, this.height); //清空结果画布
			var bufCanvasCtx = this.bufCanvas.getContext("2d");
			bufCanvasCtx.clearRect(0, 0, this.width, this.height); //清空buffer画布
			//渲染各层精灵到buffer画布上
			for (var i = 0; i < this.layers.length; i++) {
				for (var j = 0; j < this.layers[i].length; j++) {
					this.layers[i][j].draw(bufCanvasCtx);
				}
			}
			//往主图层上绘制buffer图层
			this.ctx.drawImage(this.bufCanvas, 0, 0);
		};

		/**
		 * 如果播放器seek了，清空所有弹幕
		 */
		DD.CommentFrame.prototype.clearDanmu = function() {
			for (var i = 0; i < this.layers.length; i++) {
				delete this.layers[i]; //删除相应对象
			}
			this.layers = []; //清空弹幕层数组
		};
		/**
		 * @Override
		 * 更新CommentFrame中弹幕Sprite的状态
		 */
		DD.CommentFrame.prototype.updateSprite = function() {
			for (var i = 0; i < this.layers.length; i++) {
				for (var j = 0; j < this.layers[i].length; j++) {
					//更新位置
					this.layers[i][j].move();
					//更新生命状态
					this.layers[i][j].updateLifeTime();
				}
			}
		};
		/**
		 * @Override
		 * 清除已经死亡的Sprite
		 */
		DD.CommentFrame.prototype.clearSprite = function() {
			for (var i = 0; i < this.layers.length; i++) {
				for (var j = 0; j < this.layers[i].length; j++) {
					if (!this.layers[i][j].alive) {
						delete this.layers[i][j]; //删除相应对象
						this.layers[i] = this.layers[i].slice(0, j).concat(this.layers[i].slice(j + 1, this.layers[i].length)); //清除数组中该位置
					}
				}
			}
		};



	}
};