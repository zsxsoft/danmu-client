var DD = DD || {
	REVISION: '01'
};


DD.extend = function(obj, source) {
	// ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
	if (Object.keys) {
		var keys = Object.keys(source);
		for (var i = 0, il = keys.length; i < il; i++) {
			var prop = keys[i];
			Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(source, prop));
		}
	} else {
		var safeHasOwnProperty = {}.hasOwnProperty;
		for (var prop in source) {
			if (safeHasOwnProperty.call(source, prop)) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
};

var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];


for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (window.requestAnimationFrame === undefined && window['setTimeout'] !== undefined) {
	window.requestAnimationFrame = function(callback) {
		var currTime = Date.now(),
			timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
}

if (window.cancelAnimationFrame === undefined && window['clearTimeout'] !== undefined) {
	window.cancelAnimationFrame = function(id) {
		window.clearTimeout(id)
	};
}


module.exports = DD;