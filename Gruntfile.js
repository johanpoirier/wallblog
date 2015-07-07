module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        "clean": ['web-build'],

        "copy": {
            "build": {
                files: [
                    {
                        expand: true,
                        cwd: 'web',
                        src: [
                            'img/**',
                            'css/fonts/*',
                            '.htaccess',
                            'js/nls/fr/labels.js',
                            'index.php',
                            '*.appcache',
                            'robots.txt',
                            '*.ico',
                            'pictures/*'
                        ],
                        dest: 'web-build'
                    }
                ]
            }
        },

        "processhtml": {
            dev: {
                files: {
                    'web-build/index.html': ['web/index.html']
                }
            },
            build: {
                files: {
                    'web-build/index.html': ['web/index.html']
                }
            },
            options: {
                strip: true
            }
        },

        "requirejs": {
            compile: {
                options: {
                    baseUrl: "web/js",
                    mainConfigFile: "web/js/config.js",
                    name:'main',
                    out: "web-build/js/main.js",
                    optimize: "none",
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    inlineText: true
                }
            }
        },

        "uncss": {
            clean: {
                files: {
                    'web-build/css/main.css': [
                        'phantom/home.htm',
                        'phantom/zoom.htm',
                        'phantom/login.htm',
                        'phantom/upload.htm',
                        'phantom/upload_in_progress.htm',
                        'phantom/filter.htm',
                        'phantom/filtered.htm'
                    ]
                },
                options: {
                    report: 'min',
                    stylesheets: ['../web/css/bootstrap.css', '../web/css/custom.css']
                }
            }
        },

        "uglify": {
            "require": {
                files: {
                    'web-build/js/libs/require.js': [ 'web/js/libs/require.js' ]
                }
            }
        },

        "cssmin": {
            combine: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: 0,
                    report: 'min'
                },
                files: {
                    'web-build/css/main.css': [
                        'web/css/bootstrap.css',
                        'web/css/custom.css'
                    ]
                }
            },
            minify: {
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: 0,
                    report: 'min'
                },
                files: {
                    'web-build/css/main.min.css': [
                        'web-build/css/main.css'
                    ]
                }
            }
        },

        "mochaTest": {
            test: {
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('css', [ 'clean', 'uncss:clean', 'cssmin:minify' ]);
    grunt.registerTask('dev', [ 'clean', 'cssmin:combine', 'copy', 'uglify', 'requirejs', 'processhtml:dev' ]);
    grunt.registerTask('build', [ 'clean', 'cssmin:combine', 'copy', 'uglify', 'requirejs', 'processhtml:build' ]);
    grunt.registerTask('test', ['mochaTest']);
}