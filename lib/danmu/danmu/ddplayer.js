var DD = DD || {
	REVISION: '01'
};


DD.extend = function(obj, source) {
	var prop;
	// ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
	if (Object.keys) {
		var keys = Object.keys(source);
		for (var i = 0, il = keys.length; i < il; i++) {
			prop = keys[i];
			Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(source, prop));
		}
	} else {
		var safeHasOwnProperty = {}.hasOwnProperty;
		for (prop in source) {
			if (safeHasOwnProperty.call(source, prop)) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
};



module.exports = DD;