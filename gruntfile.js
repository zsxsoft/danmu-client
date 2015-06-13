'use strict';

module.exports = function(grunt) {
	var path = require('path');

	var packageJson = grunt.file.readJSON('package.json');
	var platforms = ['win32', 'win64'];
	var buildDir = './builds/';
	var extDir = './cache/node_modules/';
	var exeName = 'nw';
	var realExeName = 'danmu';

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
					/**
					 * grunt-node-webkit不能针对特殊平台单独拷贝文件
					 * 所以这里只能选用copy来代替
					 */
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
		commands: {
			makerid: {
				cmd: (function() {
					return 'cd builds && (for /r %i in (*.node) do @echo %i && rid %i nw.exe ' + realExeName + '.exe) && (for /d %i in (nw\\win*) do @ren %i\\nw.exe ' + realExeName + '.exe)';
				})(),
				//force: true
			}
		}
	});


	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-commands');


	grunt.registerTask('default', 'danmu-client', function() {	
		var os = require('os');
		var platform = os.platform();
		var taskList = ['jshint', 'nodewebkit', 'copy'];
		if (platform == "win32" || platform == "win64") {
			taskList.push('commands:makerid');
		}
		grunt.task.run(taskList);


	});


};