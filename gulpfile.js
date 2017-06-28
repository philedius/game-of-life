'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

gulp.task('babel', function() {
    return gulp.src('./main.js')
        .pipe(babel())
        .pipe(gulp.dest('./dist'));
    
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('css/*.css', function() {
      // grab css files and send them into browserSync.stream
      // this injects the css into the page
      gulp.src('css/*.css')
        .pipe(browserSync.stream());
        console.log('Injecting css...');
    });
    gulp.watch(['main.js', 'index.html']).on('change',function() {
        // gulp.src('./main.js')
        // .pipe(babel())
        // .pipe(gulp.dest('./dist'));
        browserSync.reload();
    });
});



gulp.task('default', ['babel', 'serve']);
