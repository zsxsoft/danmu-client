'use strict';
let url = require("url");
let path = require("path");

function ImageCache() {
	this.cache = [];
	this.regex = null;
}
ImageCache.prototype.test = function (callback, text) {
	if (!this.regex) return;
	// Initialize here
	let ret = null;
	this.regex.lastIndex = 0;
	// Analyze text
	while ((ret = this.regex.exec(text)) !== null) {
		let src = ret[2];
		let imageWidth = parseInt(ret[1]);
		let imageObject = this.getImage(src);
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
	let parsedUrl = url.parse(src);
	image = window.document.createElement("img");
	image.src = parsedUrl.protocol ? src : path.resolve("./", "./" + src);
	image.width = width;
	image.onerror = function () {
		window.console.error("Cannot load " + src);
		this.cache[src].error = true;
	}
	this.cache[src] = {
		error: false,
		element: image,
		width: width, 
	};
	return this.cache[src];
}

let images = new ImageCache();



module.exports = {
	imageAnalyzer: images, 
};
