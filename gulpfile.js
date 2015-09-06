var TINYPNG_API_KEY = ''; // get your api key - https://tinypng.com/developers

var gulp = require('gulp'),
	jade = require('gulp-jade'),
	compass = require('gulp-compass'),
	argv = require('yargs').argv,
	del = require('del'),
	tinypng = require('gulp-tinypng-compress');

gulp.task('hello', function() {
	console.log('Hello! Everything is OK!');
});

// compile jade
gulp.task('jade', function() {
	gulp.src('./app/jade/pages/*.jade')
		.pipe(jade({
			pretty: ! argv.prod
		}))
		.pipe(gulp.dest('./dist/'));
});

// compile sass
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

// images
gulp.task('images:copy', function() {
	gulp.src('./app/images/**/*')
		.pipe(gulp.dest('./dist/images'));
});

gulp.task('images:tinypng', function () {
	gulp.src('./app/images/**/*.{png,jpg,jpeg}')
		.pipe(tinypng({
			key: TINYPNG_API_KEY,
			log: true
		}))
		.pipe(gulp.dest('./dist/images'));
});

// clear dist
gulp.task('clear', function() {
	del('.sass-cache');
	del('dist');
});

gulp.task('clear:dist', function() {
	del('.sass-cache');
	del(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// watcher
gulp.task('watch', function() {
	gulp.watch('./app/scss/*.scss', ['compass']);
	gulp.watch('./app/jade/*.jade', ['jade']);
	gulp.watch('./app/jade/**/*.jade', ['jade']);
});

// generate dist
gulp.task('default', ['images:copy', 'jade', 'compass'], function() {

});