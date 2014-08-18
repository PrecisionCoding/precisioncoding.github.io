
'use strict';

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

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

		/*** Connect port/livereload
			* https://github.com/gruntjs/grunt-contrib-connect
			* Starts a local webserver and injects
			* livereload snippet
			*/
		connect: {
			options: {
				port: 9000,
				livereload: LIVERELOADPORT,
				hostname: 'localhost'
			},
			livereload: {
				options: {
                    open: true,
                    base: '<%= project.app %>'
                }
			}
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

		/*** Opens the web server in the browser
			* https://github.com/jsoverson/grunt-open
			*/
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
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
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= project.app %>/**/*.html',
					'<%= project.app %>/css/**/*.css',
					'<%= project.app %>/js/**/*.js'
				]
			}
		}
	});

	// 3. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', [
		'compass',
		'concat',
		'uglify',
		'connect:livereload',
		'open',
    	'watch'
	]);

};