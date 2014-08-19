﻿
'use strict';

module.exports = function (grunt) {
	/**
	* Dynamically load npm tasks
	*/
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// 1. All configuration goes here 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/*** Set project info	*/
		project: {
			app: '',
			css: [
				'<%= project.app %>/sass/style.scss',
				'<%= project.app %>/sass/print.scss',
				'<%= project.app %>/sass/ie.scss'
			],
			js: [
				'<%= project.app %>/js/*.js'
			]
		},

		/*** Project banner
			 * Dynamically appended to CSS/JS files
			 * Inherits text from package.json
			 */
		tag: {
			banner: '/*!\n' +
					' * <%= pkg.name %>\n' +
					' * <%= pkg.title %>\n' +
					' * <%= pkg.url %>\n' +
					' * @author <%= pkg.author %>\n' +
					' * @version <%= pkg.version %>\n' +
					' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
					' */\n'
		},



    	/*** Compass
			* https://www.npmjs.org/package/grunt-contrib-compass
			* Compile Sass to CSS using Compass
			*/
		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		},

		/*** Concatenate JavaScript files
			 * https://github.com/gruntjs/grunt-contrib-concat
			 * Imports all .js files and appends project banner
			 */
		concat: {
			options: {
				stripBanners: true,
				nonull: true,
				banner: '<%= tag.banner %>'
			},
			dist: {
				src: [
					'<%= project.app %>/js/vendor/*.js',
					'<%= project.app %>/js/plugins.js',
					'<%= project.app %>/js/main.js'
				],
				dest: '<%= project.app %>/js/min/production.js',
			}
		},

		/*** Uglify (minify) JavaScript files
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 * Compresses and minifies all JavaScript files into one
		 */
		uglify: {
			options: {
				banner: '<%= tag.banner %>'
			},
			build: {
				src: '<%= project.app %>/js/min/production.js',
				dest: '<%= project.app %>/js/min/production.min.js'
			}
		},


		/*** Runs tasks against changed watched files
			 * https://github.com/gruntjs/grunt-contrib-watch
			 * Watching development files and run concat/compile tasks
			 * Livereload the browser once complete
			 */
		watch: {
			options: {
				interval: 5007,
			},
			configFiles: {
				files: ['gruntfile.js'],
				options: {
					reload: true
				}
			},
			scripts: {
				files: ['**/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false,
					reload: true
				},
			},
			css: {
				files: '<%= project.app %>/sass/**/*.scss',
				tasks: ['compass'],
				options: {
					spawn: false,
					reload: true
				}
			}
		}
	});

	// 3. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', [
		'compass',
		'concat',
		'uglify',
    	'watch'
	]);

};