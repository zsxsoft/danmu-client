/* 
 * This function based on DDPlayer Project
 * https://github.com/dpy1123/ddplayer
 */

var DD = require('./ddplayer');
var plugins = [
	require('./sprite'),
	require('./frame'),
	require('./comment'),
	require('./commentframe'),
	require('./player')
];
for (var i = 0; i <= plugins.length - 1; i++) {
	plugins[i].init.call(this, DD);
}
module.exports = DD;