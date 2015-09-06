var gulp = require('gulp'),
	jade = require('gulp-jade'),
	compass = require('gulp-compass'),
	argv = require('yargs').argv
	del = require('del');

gulp.task('hello', function() {
	console.log('Hello! Everything is OK!');
});

gulp.task('jade', function() {
	gulp.src('./app/jade/pages/*.jade')
		.pipe(jade({
			pretty: argv.prod ? false : true
		}))
		.pipe(gulp.dest('./dist/'))
});

gulp.task('compass', function() {
	gulp.src(['./app/scss/main.scss'])
		.pipe(compass({
			css: './dist/css',
			sass: './app/scss',
			image: './dist/images',
			style: argv.prod ? 'compressed' : 'expanded',
			relative_assets: false
		}))
		.on('error', function(error) {
			console.log(error);
			this.emit('end');
		});
});

gulp.task('images', function() {
	gulp.src('./app/images/**/*')
		.pipe(gulp.dest('./dist/images'))
});

gulp.task('clean', function() {
	del('dist');
});

gulp.task('clean:dist', function(callback){
	del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});

gulp.task('default', ['jade', 'images', 'compass'], function() {

});