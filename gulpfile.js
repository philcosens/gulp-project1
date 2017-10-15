var gulp = require('gulp'); 
var sass = require('gulp-sass'); // Sass to CSS
var browserSync = require('browser-sync').create(); // Syncs up with browser
var useref = require('gulp-useref'); // Allows to reference multiple directories
var uglify = require('gulp-uglify'); // JS compression
var gulpIf = require('gulp-if'); // Allows condition if with callback
var pump = require('pump');  // Used similar to pipe, but better error handling
var cssnano = require('gulp-cssnano'); // CSS Mininfication
var imagemin = require('gulp-imagemin'); // Optimize images
var cache = require('gulp-cache'); // caching proxy task
var runSequence = require('run-sequence'); // allows us to run gulp tasks in a specifc order

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())  //using gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
})

// Not part of first tutorial but useful using pump
gulp.task('compress', function (cb) {
    // pump streams pipes together and provides a callback
    // pump is better for error handling than just pipe alone
    pump([
          gulp.src('app/js/**/*.js'),
          uglify(),
          gulp.dest('dist')
      ],
      cb
    );
});

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        //Minifies only if its a JS file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
})

gulp.task('images', function() {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
})

// As fonts are already opimized just need to copy across to dist
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function () {
    return del.sync('dist');
})

gulp.task('build', function(callback) {
    runSequence('clean:dist', 
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
})

gulp.task('default', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
})

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Other watchers
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
})

