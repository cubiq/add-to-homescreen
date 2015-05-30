var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');

gulp.task('default', ['compress','css'], function() {
});

gulp.task('lint', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('addtohomescreen.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('compress',['scripts'], function() {
  return gulp.src('./dist/js/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('compressCss', function () {
  gulp.src('./src/css/*.css')
    .pipe(concat('addtohomescreen.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('css', ['compressCss'], function () {
    gulp.src('./src/css/*.css')
        .pipe(minifyCss())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./dist/css'));
});
 