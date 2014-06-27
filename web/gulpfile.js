var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    handlebars = require('gulp-ember-handlebars'),
    less       = require('gulp-less'),
    livereload = require('gulp-livereload');
    gutil      = require('gulp-util');

var paths = {
  scripts: ['app/wallblog.js', 'app/**/*.js'],
  templates: 'app/templates/**/*.hbs',
  less: 'less/*'
};

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
      .pipe(concat('wallblog.js'))
      .on('error', gutil.log)
      .pipe(gulp.dest('js/'));
});

gulp.task('templates', function() {
  gulp.src(paths.templates)
      .pipe(handlebars({
        outputType: 'browser'
      }))
      .on('error', gutil.log)
      .pipe(concat('templates.js'))
      .pipe(gulp.dest('js/'));
});

gulp.task('less', function() {
  gulp.src('less/main.less')
      .pipe(less())
      .on('error', gutil.log)
      .pipe(gulp.dest('css/'));
});


gulp.task('watch', function() {
  var server = livereload();
  var changed = function(file) {
    server.changed(file.path);
  };
  gulp.watch(paths.scripts, ['scripts']).on('change', changed);
  gulp.watch(paths.templates, ['templates']).on('change', changed);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.css).on('change', changed);
});

gulp.task('default', ['scripts', 'templates', 'less']);
