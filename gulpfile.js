/*
 TODO:
 js copy
 js minify
 *.css copy
 *.css minify
 dist/css megree & minify
*/

/*----------------------------------
| Configuration
| Get your tinypng api key:
|	https://tinypng.com/developers
-----------------------------------*/
var config = {
	tinypng_api_key: '',
	app_base: './app',
	dist_base: './dist',
	sass_cache: './.sass-cache',
	autoprefixer: ['last 3 version']
},

path = {
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
},

/*---------------------------
| Scss files to compilation
----------------------------*/
scssCompile = [
	path.app.scss + '/main.scss'
],

/*--------------
| Concat rules
---------------*/
concatJS = {
	'main.js': [
		'main.js'
	]
},

concatCSS = {

},

/*------------
| Gulp tasks
-------------*/
gulp = require('gulp'),
jade = require('gulp-jade'),
compass = require('gulp-compass'),
argv = require('yargs').argv,
del = require('del'),
tinypng = require('gulp-tinypng-compress'),
browserSync = require('browser-sync').create(),
watch = require('gulp-watch'),
autoprefixer = require('gulp-autoprefixer');

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
	gulp.src(scssCompile)
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
		.pipe(autoprefixer({
			browsers: config.autoprefixer
		}))
		.pipe(gulp.dest(path.dist.css))
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

gulp.task('images:copy-watch', function() {
	gulp.src(path.watch.images, { base: path.app.images })
		.pipe(watch(path.app.images, { base: path.app.images }))
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

gulp.task('fonts-watch', function() {
	gulp.src(path.watch.fonts, { base: path.app.fonts })
		.pipe(watch(path.app.fonts, { base: path.app.fonts }))
		.pipe(gulp.dest(path.dist.fonts));
});

// clear dist
gulp.task('clear', function() {
	if (argv.noimg) {
		del([
			config.sass_cache,
			config.dist_base + '/**/*',
			'!' + config.dist_base + '/images',
			'!' + config.dist_base + '/images/**/*'
		]);

		return;
	}

	del([
		config.sass_cache,
		config.dist_base
	]);
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
gulp.task('default', ['generate', 'images:copy-watch', 'fonts-watch'], function() {
	browserSync.init({
		server: path.dist.base
	});

	gulp.watch(path.watch.scss, ['compass']);
	gulp.watch(path.watch.js, ['javascript']);
	gulp.watch(path.watch.jade, ['jade']).on('change', browserSync.reload);
});