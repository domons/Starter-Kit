/*
 TODO:
 js concat
 *.css copy
 css concat
*/

/*----------------------------------
| Configuration
| Get your tinypng api key:
|	https://tinypng.com/developers
-----------------------------------*/
var config = {
	tinypngApiKey: '',
	appBase: './app',
	distBase: './dist',
	sassCache: './.sass-cache',
	autoprefixer: ['last 5 version']
},

path = {
	app: {
		css: config.appBase + '/css',
		fonts: config.appBase + '/fonts',
		images: config.appBase + '/images',
		jade: config.appBase + '/jade',
		jade_pages: config.appBase + '/jade/pages',
		js: config.appBase + '/js',
		scss: config.appBase + '/scss'
	},
	dist: {
		css: config.distBase + '/css',
		fonts: config.distBase + '/fonts',
		images: config.distBase + '/images',
		js: config.distBase + '/js'
	},
	watch: {
		css: config.appBase + '/css/**/*.css',
		distCss: config.distBase + '/css/**/*.css',
		fonts: config.appBase + '/fonts/**/*',
		images: config.appBase + '/images/**/*',
		distImages: config.distBase + '/images/**/*.{png,jpg,jpeg}',
		jade: config.appBase + '/jade/**/*.jade',
		jade_pages: config.appBase + '/jade/pages/*.jade',
		js: config.appBase + '/js/**/*.js',
		scss: config.appBase + '/scss/**/*.scss'
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
autoprefixer = require('gulp-autoprefixer'),
runSequence = require('run-sequence'),
minifyCss = require('gulp-minify-css'),
gulpif = require('gulp-if'),
jsmin = require('gulp-jsmin');

gulp.task('hello', function() {
	console.log('Hello! Everything is OK!');
});

// compile jade
gulp.task('jade', function() {
	return gulp.src(path.watch.jade_pages)
		.pipe(jade({
			pretty: ! argv.prod
		}))
		.pipe(gulp.dest(config.distBase));
});

// compile sass
gulp.task('compass', function() {
	return gulp.src(scssCompile)
		.pipe(compass({
			css: path.dist.css,
			sass: path.app.scss,
			image: path.dist.images,
			fonts: path.dist.fonts,
			style: 'expanded',
			relative_assets: false
		}))
		.on('error', function(error) {
			console.log(error);
			this.emit('end');
		})
		.pipe(gulp.dest(path.dist.css));
});

// post production css
gulp.task('postProdCss', function() {
	return gulp.src(path.watch.distCss)
		.pipe(autoprefixer({
			browsers: config.autoprefixer
		}))
		.pipe(gulpif(argv.prod, minifyCss()))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.stream());
});

// javascript
gulp.task('javascript', function() {
	return gulp.src(path.watch.js)
		.pipe(gulpif(argv.prod, jsmin()))
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.stream());
});

// images
gulp.task('images:copy', function() {
	return gulp.src(path.watch.images)
		.pipe(gulp.dest(path.dist.images));
});

gulp.task('images:copy-watch', function() {
	gulp.src(path.watch.images, { base: path.app.images })
		.pipe(watch(path.app.images, { base: path.app.images }))
		.pipe(gulp.dest(path.dist.images));
});

gulp.task('images:tinypng', function () {
	return gulp.src(path.watch.distImages)
		.pipe(tinypng({
			key: config.tinypngApiKey,
			log: true
		}))
		.pipe(gulp.dest(path.dist.images));
});

// fonts
gulp.task('fonts', function() {
	return gulp.src(path.watch.fonts)
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
		return del([
			config.sassCache,
			config.distBase + '/**/*',
			'!' + config.distBase + '/images',
			'!' + config.distBase + '/images/**/*'
		]);
	}

	return del([
		config.sassCache,
		config.distBase
	]);
});

// build dist
gulp.task('build', function() {
	runSequence(
		'clear',
		[
			'fonts',
			'images:copy',
			'javascript',
			'jade'
		],
		'compass',
		'postProdCss'
	);
});

// dev env | browser-sync & watchers
gulp.task('default', ['images:copy-watch', 'fonts-watch'], function() {
	browserSync.init({
		server: config.distBase
	});

	gulp.watch(path.watch.scss, ['compass']);
	gulp.watch(path.watch.distCss, ['postProdCss']);
	gulp.watch(path.watch.js, ['javascript']);
	gulp.watch(path.watch.jade, ['jade']).on('change', browserSync.reload);
});