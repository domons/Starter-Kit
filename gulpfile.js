var config = {
	app_base: './app',
	dist_base: './dist',
	tinypng_api_key: '' // get your api key - https://tinypng.com/developers
};

var path = {
	app: {
		base: config.app_base,
		css: config.app_base + '/css',
		fonts: config.app_base + '/fonts',
		images: config.app_base + '/images',
		jade: config.app_base + '/jade',
		jade_pages: config.app_base + '/jade/pages',
		js: config.app_base + '/js',
		scss: config.app_base + '/scss'
	},
	dist: {
		base: config.dist_base,
		css: config.dist_base + '/css',
		fonts: config.dist_base + '/fonts',
		images: config.dist_base + '/images',
		js: config.dist_base + '/js'
	},
	watch: {
		css: config.app_base + '/css/**/*.css',
		fonts: config.app_base + '/fonts/**/*',
		images: config.app_base + '/images/**/*',
		images_ext: config.dist_base + '/images/**/*.{png,jpg,jpeg}',
		jade: config.app_base + '/jade/**/*.jade',
		jade_pages: config.app_base + '/jade/pages/*.jade',
		js: config.app_base + '/js/**/*.js',
		scss: config.app_base + '/scss/**/*.scss'
	}
};

var jsMegree = {
	'main.js': [
		'main.js'
	]
};

// Files scss to compile
var scssOutput = [
	'./app/scss/main.scss'
];


var gulp = require('gulp'),
	jade = require('gulp-jade'),
	compass = require('gulp-compass'),
	argv = require('yargs').argv,
	del = require('del'),
	tinypng = require('gulp-tinypng-compress'),
	browserSync = require('browser-sync').create();

gulp.task('hello', function() {
	console.log('Hello! Everything is OK!');
});

// compile jade
gulp.task('jade', function() {
	gulp.src(path.watch.jade_pages)
		.pipe(jade({
			pretty: ! argv.prod
		}))
		.pipe(gulp.dest(path.dist.base));
});

// compile sass
gulp.task('compass', function() {
	gulp.src(scssOutput)
		.pipe(compass({
			css: path.dist.css,
			sass: path.app.scss,
			image: path.dist.images,
			fonts: path.dist.fonts,
			style: argv.prod ? 'compressed' : 'expanded',
			relative_assets: false
		}))
		.on('error', function(error) {
			console.log(error);
			this.emit('end');
		})
		.pipe(browserSync.stream());
});

// javascript
gulp.task('javascript', function() {
	gulp.src(path.watch.js)
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.stream());
});

// images
gulp.task('images:copy', function() {
	gulp.src(path.watch.images)
		.pipe(gulp.dest(path.dist.images));
});

gulp.task('images:tinypng', function () {
	gulp.src(path.watch.images_ext)
		.pipe(tinypng({
			key: config.tinypng_api_key,
			log: true
		}))
		.pipe(gulp.dest(path.dist.images));
});

// fonts
gulp.task('fonts', function() {
	gulp.src(path.watch.fonts)
		.pipe(gulp.dest(path.dist.fonts));
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

// generate dist
gulp.task('generate', [
	'images:copy',
	'fonts',
	'javascript',
	'jade',
	'compass'
]);

// browser-sync & watcher
gulp.task('default', function() {
	browserSync.init({
		server: path.dist.base
	});

	gulp.watch(path.watch.scss, ['compass']);
	gulp.watch(path.watch.js, ['javascript']);
	gulp.watch(path.watch.fonts, ['fonts']);
	gulp.watch(path.watch.jade, ['jade']).on('change', browserSync.reload);
});

/*
	TODO:
		js copy
		js minify
		fonts copy
		*.css copy
		*.css minify
		dist/css megree & minify
*/