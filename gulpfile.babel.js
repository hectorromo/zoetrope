import gulp from 'gulp'
import concat from 'gulp-concat'
import babel from 'gulp-babel'
import browserSync from 'browser-sync'


gulp.task('js', () => {
    gulp.src([
			'./node_modules/howler/dist/howler.js',
    		'./js/zoetrope.js',
    		'./js/main.js'
    	])
    // gulp.src('js/**/*.js') 
        .pipe(babel())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('js-watch', ['js'], (done) => {
    browserSync.reload();
    done();
});



gulp.task('watch', () => {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });

	gulp.watch('./js/**/*.js', ['js-watch']);
	gulp.watch("./*.html").on('change', browserSync.reload);
});


gulp.task('build', ['js']);
gulp.task('default', ['watch']);
