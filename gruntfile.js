'use strict';

module.exports = function(grunt) {
	var packageJson = grunt.file.readJSON('package.json');
	var encode = grunt.option('encode') || 'utf8';
	var language = grunt.option('language') || 'node';
	var doNotCompile = grunt.option("without-compile") || false;
	language = language.toLowerCase();

	grunt.initConfig({
		pkg: packageJson,
		nodewebkit: {
			options: {
				platforms: ['win'],
				buildDir: './webkitbuilds',
				appName: "nw"
			},
			src: ['./*', './lib/**', './node_modules/socket.io-client/**', './node_modules/nw-penetrate/**'], // Your node-webkit app
			
		},
		jshint: {
			options: {
				"-W061": true
			},
			src: ['./app.js', './lib/*'],
		},
	});


	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.loadNpmTasks('grunt-contrib-jshint');


	grunt.registerTask('default', 'danmu-client', function() {
		var tasks = [];
		tasks.push("jshint", "nodewebkit");
		grunt.task.run(tasks);

		// 懒得用grunt插件了
		
	});


};