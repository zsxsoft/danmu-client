'use strict';

module.exports = function(grunt) {
	var path = require('path');

	var packageJson = grunt.file.readJSON('package.json');
	var platforms = ['win32', 'win64'];
	var buildDir = './builds/';
	var extDir = './cache/node_modules/';
	var exeName = 'nw';

	grunt.initConfig({
		pkg: packageJson,
		nodewebkit: {
			options: {
				version: "0.12.1", // https://github.com/mllrsohn/node-webkit-builder/issues/222
				platforms: platforms,
				buildDir: buildDir,
				appName: exeName,
				winIco: "./icon.ico"
			},
			src: ['package.json'], // Your node-webkit app
		},
		jshint: {
			options: {
				"-W061": true,
				"multistr": true
			},
			src: ['./app.js', './lib/*'],
		},
		copy: {
			main: {
				files: (function() {
					var copyFiles = [];
					platforms.forEach(function(platform) {
						copyFiles.push({
							expand: true,
							src: [
								'./package.json', './panel.*', './index.*', './config.js', './lib/**', 
								'./node_modules/socket.io-client/**', 
								'./node_modules/nw-penetrate/package.json', './node_modules/nw-penetrate/bindings-fork/**', './node_modules/nw-penetrate/index.js'],
							dest: buildDir + exeName + "/" + platform
						});
						copyFiles.push({
							cwd: extDir + platform,
							src: ['./**'],
							dest: buildDir + exeName + "/" + platform + '/node_modules',
							expand: true
						});
					});
					return copyFiles;
				})()
			}
		},
	});


	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');


	grunt.registerTask('default', 'danmu-client', function() {
		var tasks = [];
		tasks.push("jshint");
		tasks.push("nodewebkit");
		tasks.push("copy");
		grunt.task.run(tasks);

	});


};