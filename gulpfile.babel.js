/***************** *****************/
/*********** DEPENDENCIES **********/
/***************** *****************/

import gulp from 'gulp';
import webpack from 'webpack';
import addsrc from 'gulp-add-src';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import connect from 'gulp-connect';
import cssmin from 'gulp-cssmin';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import preprocess from 'gulp-preprocess';
import requirejsOptimize from 'gulp-requirejs-optimize';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import util from 'gulp-util';

import del from 'del';
import path from 'path';
import runSequence from 'run-sequence';
import pngquant from 'imagemin-pngquant';
import { argv as args } from 'yargs';
import exec from 'child_process';

//var webpackConfig = require('webpack.config');


/***************** *****************/
/************ ARGUMENTS ************/
/***************** *****************/

var debug = false;
var env = args.env;
var buildVersion = false;

if (env === undefined) {
  env = 'local';
  debug = true;
}

console.log(` --> environment : ${env}`);
console.log(` --> debug : ${debug}`);
console.log('');


/***************** *****************/
/************** PATH ***************/
/***************** *****************/

const paths = {
  css: ['./app/css/*.css'],
  fonts: [
    './app/font/*.eot',
    './app/font/*.svg',
    './app/font/*.ttf',
    './app/font/*.woff',
    './app/font/*.woff2'
  ],
  js: ['./app/js/**/*.js'],
  require: ['./app/js/vendor/requirejs/require.js'],
  nls: {
    'all': ['./app/js/nls/**/*.js'],
    'fr': ['./app/js/nls/fr/labels.js']
  },
  extra: [
    './app/.htaccess',
    './app/favicon.ico',
    './app/manifest.*',
    './app/robots.txt',
    './app/sitemap.xml',
    './app/index.php',
    './app/js/analytics.js'
  ],
  images: ['./app/img/*.png'],
  pictures: [
    './app/pictures/empty.jpg',
    './app/pictures/empty--*.jpg'
  ],
  html: ['./app/*.html'],
  templates: ['./app/templates/*'],
  dist: {
    root: './dist',
    css: './dist/css/',
    fonts: './dist/font/',
    images: './dist/img/',
    pictures: './dist/pictures/',
    js: './dist/js/',
    nls: './dist/nls'
  }
};


/***************** *****************/
/************** CLEAN **************/
/***************** *****************/

gulp.task('clean', function (cb) {
  del([paths.dist.root], cb);
});


/***************** *****************/
/************** BUILD **************/
/***************** *****************/

gulp.task('compile-css', () => {
  return gulp.src(paths.css)
    .pipe(gulpif(!debug, cssmin()))
    .pipe(gulpif(!debug, autoprefixer()))
    .pipe(concat('main' + (buildVersion ? buildVersion : '') + '.css'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(connect.reload());
});

gulp.task('copy-fonts', () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist.fonts));
});

gulp.task('copy-images', () => {
  return gulp.src(paths.images)
    .pipe(gulpif(!debug, imagemin({
      progressive: true,
      svgoPlugins: [
        { removeViewBox: false }
      ],
      use: [pngquant()]
    })))
    .pipe(gulp.dest(paths.dist.images))
    .pipe(connect.reload());
});

gulp.task('copy-pictures', () => {
  return gulp.src(paths.pictures)
    .pipe(gulp.dest(paths.dist.pictures));
});

gulp.task('copy-extra', () => {
  return gulp.src(paths.extra)
    .pipe(gulp.dest(paths.dist.root));
});

gulp.task('compile-scripts', () => {
  return gulp.src('./app/js/main.js')
    .pipe(sourcemaps.init())
    .pipe(requirejsOptimize({
      baseUrl: './app/js',
      name: 'main',
      mainConfigFile: './app/js/config.js',
      preserveLicenseComments: false,
      findNestedDependencies: true,
      inlineText: true,
      optimize: 'none',
      optimizeCss: 'none',
      include: ['nls/labels', 'nls/fr/labels']
    }))
    .pipe(addsrc.prepend(paths.require))
    .pipe(concat('wallblog' + (buildVersion ? buildVersion : '') + '.js'))
    .pipe(gulpif(!debug, uglify()))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task("webpack", function(callback) {
  // run webpack
  webpack(Object.create(webpackConfig), function(err, stats) {
    if(err) throw new util.PluginError("webpack", err);
    util.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task('compile-html', () => {
  var context = {};
  if (debug) {
    context.DEBUG = true;
  }
  context.BUILD_VERSION = (buildVersion !== false) ? buildVersion : '';
  return gulp.src(paths.html)
    .pipe(preprocess({ 'context': context }))
    .pipe(gulpif(!debug, htmlmin({ 'collapseWhitespace': true })))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(connect.reload());
});


/****************** *****************/
/*************** TOOLS **************/
/****************** *****************/

gulp.task('watch-codebase', () => {
  if (debug) {
    gulp.watch(paths.css, ['compile-css']);
    gulp.watch(paths.extra, ['copy-extra']);
    gulp.watch(paths.images, ['copy-images']);
    gulp.watch(paths.templates, ['compile-scripts']);
    gulp.watch(paths.html, ['compile-html']);
  }
});


/****************** *****************/
/************ MAIN TASKS ************/
/****************** *****************/

var buildTasks = ['copy-extra', 'copy-fonts', 'copy-images', 'copy-pictures', 'compile-html', 'compile-css'];
gulp.task('build', buildTasks);

gulp.task('default', () => {
  if (debug) {
    buildTasks.push('copy-pictures');
  }
  runSequence('clean', 'build', 'web-server', 'watch-codebase');
});

gulp.task('package', () => {
  debug = false;
  buildVersion = Math.floor(Math.random() * 100000000);
  runSequence('clean', 'build');
});


/****************** *****************/
/************ WEB SERVER ************/
/****************** *****************/

gulp.task('web-server', () => {
  return connect.server({
    root: paths.dist.root,
    livereload: true
  });
});
