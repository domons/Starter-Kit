/*
 TODO:
 js concat order
 *.css copy
 css concat
*/

/*--------------------------------------------------------
| Configuration
| Get your tinypng api key:
|	https://tinypng.com/developers
--------------------------------------------------------*/
var config = {
	tinypngApiKey: '',
	appBase: './app',
	distBase: './dist',
	sassCache: './.sass-cache',
	autoprefixer: ['last 15 version']
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
		scss: config.appBase + '/scss/**/*.scss',
		extras: [config.appBase + '/*.{ico,png,txt}', config.appBase + '/.*']
	}
},


/*--------------------------------------------------------
| Scss files to compilation
--------------------------------------------------------*/
compileScssFiles = [
	path.app.scss + '/main.scss'
],


/*--------------------------------------------------------
| Concat rules
--------------------------------------------------------*/
concatJsFiles = {
//	main: [
//		path.app.js + '/main.js',
//		path.app.js + '/new.js',
//		path.app.js + '/*.js'
//	]
},

concatCssFiles = {
//	main: [
//		'main.js',
//		'test.js'
//	]
},

/*--------------------------------------------------------
| Gulp modules
--------------------------------------------------------*/
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
jsmin = require('gulp-jsmin'),
concat = require('gulp-concat'),
concatCont = require('gulp-continuous-concat');


/*--------------------------------------------------------
| Jade
--------------------------------------------------------*/
function jadeTask() {
	return gulp.src(path.watch.jade_pages)
		.pipe(jade({
			pretty: ! argv.prod
		}))
		.pipe(gulp.dest(config.distBase));
}

gulp.task('jade', jadeTask);

gulp.task('jade-watch', function() {
	watch(path.watch.jade, function() {
		jadeTask().pipe(browserSync.reload({stream:true}));
	});
});


/*--------------------------------------------------------
| Compass (sass)
--------------------------------------------------------*/
function compassTask() {
	return gulp.src(compileScssFiles)
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
		.pipe(autoprefixer({
			browsers: config.autoprefixer
		}))
		.pipe(gulpif(argv.prod, minifyCss()))
		.pipe(gulp.dest(path.dist.css));
}

gulp.task('compass', compassTask);

gulp.task('compass-watch', function() {
	watch(path.watch.scss, function() {
		compassTask().pipe(browserSync.stream());
	});
});


/*--------------------------------------------------------
| Javascript concat
--------------------------------------------------------*/
function concatJsTask(file) {
	gulp.task('javascript:concat:' + file, function() {
		return gulp.src(concatJsFiles[file])
			.pipe(concat(file + '.js'))
			.pipe(gulpif(argv.prod, jsmin()))
			.pipe(gulp.dest(path.dist.js));
	});
}

var concatJsTasks = [];
for (var file in concatJsFiles) {
	concatJsTask(file);
	concatJsTasks.push('javascript:concat:' + file);
}

gulp.task('javascript:concat', concatJsTasks);

gulp.task('javascript:concat-watch', function() {
	for (var file in concatJsFiles) {
		gulp.src(concatJsFiles[file])
			.pipe(watch(concatJsFiles[file]))
			.pipe(concatCont(file + '.js'))
			.pipe(gulpif(argv.prod, jsmin()))
			.pipe(gulp.dest(path.dist.js))
			.pipe(browserSync.stream());
	}
});


/*--------------------------------------------------------
| Javascript copy
--------------------------------------------------------*/
function jsCopyTask() {
	return gulp.src(path.watch.js)
		.pipe(gulpif(argv.prod, jsmin()))
		.pipe(gulp.dest(path.dist.js));
}

gulp.task('javascript:copy', jsCopyTask);

gulp.task('javascript:copy-watch', function() {
	watch(path.watch.js, function() {
		jsCopyTask().pipe(browserSync.stream());
	});
});


/*--------------------------------------------------------
| Images copy
--------------------------------------------------------*/
function imagesCopyTask() {
	return gulp.src(path.watch.images)
		.pipe(gulp.dest(path.dist.images));
}

gulp.task('images:copy', imagesCopyTask);

gulp.task('images:copy-watch', function() {
	watch(path.watch.images, imagesCopyTask);
});


/*--------------------------------------------------------
| Fonts
--------------------------------------------------------*/
function fontsTask() {
	return gulp.src(path.watch.fonts)
		.pipe(gulp.dest(path.dist.fonts));
}

gulp.task('fonts', fontsTask);

gulp.task('fonts-watch', function() {
	watch(path.watch.fonts, fontsTask);
});


/*--------------------------------------------------------
| Extra files
--------------------------------------------------------*/
function extrasTask() {
	return gulp.src(path.watch.extras)
		.pipe(gulp.dest(config.distBase));
}

gulp.task('extras', extrasTask);

gulp.task('extras-watch', function() {
	watch(path.watch.extras, extrasTask);
});


/*--------------------------------------------------------
| Tinypng
--------------------------------------------------------*/
gulp.task('images:tinypng', function () {
	return gulp.src(path.watch.distImages)
		.pipe(tinypng({
			key: config.tinypngApiKey,
			log: true
		}))
		.pipe(gulp.dest(path.dist.images));
});


/*--------------------------------------------------------
| Clear dist
--------------------------------------------------------*/
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


/*--------------------------------------------------------
| Build dist
--------------------------------------------------------*/
var javascriptTask = Object.keys(concatJsFiles).length ? 'javascript:concat' : 'javascript:copy';

gulp.task('build', function() {
	runSequence(
		'clear',
		['fonts', 'images:copy', javascriptTask, 'jade', 'extras'],
		'compass'
	);
});


/*--------------------------------------------------------
| Develop dist
--------------------------------------------------------*/
gulp.task('default',
	[
		'fonts-watch',
		'images:copy-watch',
		javascriptTask + '-watch',
		'jade-watch',
		'extras-watch',
		'compass-watch'
	],
	function() {
		browserSync.init({
			server: config.distBase
		});
	}
);