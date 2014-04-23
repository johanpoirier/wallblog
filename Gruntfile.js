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
                            'js/libs/require.js',
                            'js/nls/fr/labels.js',
                            '.htaccess',
                            'index.php',
                            'app.appcache',
                            'robots.txt',
                            '*.ico'
                        ],
                        dest: 'web-build'
                    }
                ]
            }
        },

        "uncss": {
            build: {
                src: ['web/index.html'],
                dest: 'web-build/css/main.css'
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
                    optimize: "uglify2",
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    inlineText: true
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
            }
        },

        "mochaTest": {
            test: {
                src: ['test/**/*.js']
            }
        }
    });

    grunt.registerTask('dev', [ 'clean', 'cssmin', 'copy', 'requirejs', 'processhtml:dev' ]);
    grunt.registerTask('build', [ 'clean', 'cssmin', 'copy', 'requirejs', 'processhtml:build' ]);
    grunt.registerTask('test', ['mochaTest']);
}