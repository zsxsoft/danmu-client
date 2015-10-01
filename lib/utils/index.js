function ImageCache() {
	this.cache = [];
	this.regex = null;
}
ImageCache.prototype.test = function (callback, text) {
	if (!this.regex) return;
	// Initialize here
	var ret = null;
	this.regex.lastIndex = 0;
	// Analyze text
	while ((ret = this.regex.exec(text)) !== null) {
		var src = ret[2];
		var imageWidth = parseInt(ret[1]);
		var imageObject = this.getImage(src);
		if (imageObject === null) {
			imageObject = this.buildCache(src, imageWidth);
		}
		callback(ret, imageObject);
	}
	this.regex.lastIndex = 0;
}
ImageCache.prototype.getImage = function (src) {
	return this.cache[src] || null;
}
ImageCache.prototype.buildCache = function (src, width) {
	image = window.document.createElement("img");
	image.src = src;
	image.width = width;
	image.onerror = function () {
		window.console.error("Cannot load " + src);
		this.cache[src].error = true;
	}
	this.cache[src] = {
		error: false,
		element: image,
		width: width
	};
	return this.cache[src];
}

var images = new ImageCache();
module.exports = {
	imageAnalyzer: images
};
