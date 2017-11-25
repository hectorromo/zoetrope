import gulp from 'gulp'
import concat from 'gulp-concat'
import babel from 'gulp-babel'


gulp.task('scripts', () => {
    gulp.src([
    		'./js/zoetrope.js',
    		'./js/main.js'
    	])
        .pipe(babel())
        .pipe(concat('dist.js'))
        .pipe(gulp.dest('dist/js/'));
})

gulp.task('watch', () => {
	gulp.watch('./js/**/*.js', ['scripts']);
});

gulp.task('build', ['scripts']);
gulp.task('default', ['watch']);