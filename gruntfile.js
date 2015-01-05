
'use strict';

module.exports = function (grunt) {
  /**
  * Dynamically load npm tasks
  */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // 1. All configuration goes here 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /*** Set project info */
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

    /*** Notify
       * https://github.com/dylang/grunt-notify
       * Automatic Notifications for Grunt tasks
       */
    notify_hooks: {
      options: {
        enabled: true,
        success: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output
      }
    },

    notify: {
      compass: { 
        options: { 
          title: "CSS COMPILED", 
          message: "Compass Task Completed",
        } 
      }
    },

      /*** Connect
      * https://www.npmjs.org/package/grunt-contrib-connect
      * Start a connect web server.
      */
    connect: {
      server: {
        options: {
          port: 8001,
          base: {
            options: {
              index: 'index.html',
              maxAge: 300000
            }
          }
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
        banner: '<%= tag.banner %>',
        sourceMap: true
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
          livereload: true
        },
      },
      css: {
        files: 'sass/**/*.scss',
        tasks: ['compass', 'notify:compass'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      dont: {
        files: ['!**/node_modules/**']
      }
    }
  });

  // 3. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask(
    'default', [
      'compass',
      'concat',
      'uglify',
      'notify_hooks',
      'watch',
      'connect'
      ]
    );

};