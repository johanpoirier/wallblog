/***************** *****************/
/*********** DEPENDENCIES **********/
/***************** *****************/

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var gulpif = require('gulp-if');
var args = require('yargs').argv;
var del = require('del');
var pngquant = require('imagemin-pngquant');
var requirejsOptimize = require('gulp-requirejs-optimize');
var addsrc = require('gulp-add-src');
var path = require('path');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;


/***************** *****************/
/************ ARGUMENTS ************/
/***************** *****************/

var debug = false;
var env = args.env;

if (env === undefined) {
  env = 'local';
  debug = true;
}

console.log(" --> environment : " + env);
console.log(" --> debug : " + debug);
console.log("");


/***************** *****************/
/************** PATH ***************/
/***************** *****************/

var paths = {
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
  nls: ['./app/js/nls/**/*.js'],
  extra: [
    './app/.htaccess',
    './app/favicon.ico',
    './app/manifest.*',
    './app/robots.txt',
    './app/sitemap.xml',
    './app/index.php'
  ],
  images: ['./app/img/*.png'],
  pictures: [
    './app/pictures/empty.jpg',
    './app/pictures/m*.*'
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

gulp.task('compile-css', function () {
  return gulp.src(paths.css)
    .pipe(gulpif(!debug, plugins.cssmin()))
    .pipe(plugins.concat('main.css'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(plugins.connect.reload());
});

gulp.task('copy-fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist.fonts));
});

gulp.task('copy-images', function () {
  return gulp.src(paths.images)
    .pipe(plugins.imagemin({
      progressive: true,
      svgoPlugins: [
        { removeViewBox: false }
      ],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.dist.images))
    .pipe(plugins.connect.reload());
});

gulp.task('copy-pictures', function () {
  return gulp.src(paths.pictures)
    .pipe(gulp.dest(paths.dist.pictures));
});

gulp.task('copy-extra', function () {
  return gulp.src(paths.extra)
    .pipe(gulp.dest(paths.dist.root));
});

gulp.task('copy-nls', function () {
  return gulp.src(paths.nls)
    .pipe(gulp.dest(paths.dist.nls));
});

gulp.task('compile-scripts', ['copy-nls'], function () {
  return gulp.src('./app/js/main.js')
    .pipe(requirejsOptimize({
      baseUrl: "./app/js",
      name: "main",
      mainConfigFile: "./app/js/config.js",
      preserveLicenseComments: false,
      findNestedDependencies: true,
      inlineText: true,
      optimize: "none"
    }))
    .pipe(addsrc.prepend(paths.require))
    .pipe(plugins.concat("wallblog.js"))
    .pipe(gulpif(!debug, plugins.uglify()))
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('compile-html', function () {
  var context = {};
  return gulp.src(paths.html)
    .pipe(plugins.preprocess({ 'context': context }))
    .pipe(gulpif(!debug, plugins.htmlmin({ 'collapseWhitespace': true })))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(plugins.connect.reload());
});


/****************** *****************/
/*************** TOOLS **************/
/****************** *****************/

gulp.task('watch-codebase', function () {
  if (debug) {
    gulp.watch(paths.css, ['compile-css']);
    gulp.watch(paths.extra, ['copy-extra']);
    gulp.watch(paths.images, ['copy-images']);
    gulp.watch(paths.js, ['compile-scripts']);
    gulp.watch(paths.templates, ['compile-scripts']);
    gulp.watch(paths.html, ['compile-html']);
  }
});


/****************** *****************/
/************ MAIN TASKS ************/
/****************** *****************/

var buildTasks = ['copy-extra', 'copy-fonts', 'copy-images', 'compile-html', 'compile-css', 'compile-scripts'];
gulp.task('build', buildTasks);

gulp.task('default', function () {
  if (debug) {
    buildTasks.push('copy-pictures');
  }
  runSequence('clean', 'build', 'web-server', 'watch-codebase');
});

gulp.task('package', function () {
  debug = false;
  runSequence('clean', 'build');
});


/****************** *****************/
/************ WEB SERVER ************/
/****************** *****************/

gulp.task('web-server', function () {
  return plugins.connect.server({
    root: paths.dist.root,
    livereload: true
  });
});
