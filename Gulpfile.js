const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcempas = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');

const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const fs = require('fs');

gulp.task('css', () => {
  return gulp.src('./src/scss/main.scss')
    .pipe(sourcempas.init())
    .pipe(sass({ errLogToConsole: true, outputStyle: 'expanded' }))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min'}))
    .pipe(sourcempas.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  let b = browserify({
    entries: './src/js/main.js',
    transform: ['babelify']
  });

  return b.bundle()
    .on('error', gutil.log)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/js'))
    .pipe(sourcempas.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcempas.write('./'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src('./src/images/*')
    .pipe(imagemin([
      imageminPngquant({ quality: '65-80' }),
      imageminMozjpeg(),
      imagemin.gifsicle({interlaced: true}),
      imagemin.svgo({plugins: [{removeViewBox: true}]})
    ], { verbose: true }))
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('html', () => {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
});

gulp.task('build', ['html', 'css', 'js', 'images', 'fonts']);

gulp.task('default', ['html', 'css', 'js', 'images', 'fonts', 'browser-sync'], () => {
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/scss/**/*.scss', ['css']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/images/*', ['images']);
  gulp.watch('./src/fonts/*', ['fonts']);
});
