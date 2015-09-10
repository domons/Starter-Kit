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
 | Test gulp task
 --------------------------------------------------------*/
gulp.task('hello', function() {
	console.log('Hello! Everything is OK!');
});


/*--------------------------------------------------------
| Jade task
--------------------------------------------------------*/
function jadeTask(watcher) {
	var res = gulp.src(path.watch.jade_pages);

	if (watcher) {
		res = gulp.src(path.watch.jade_pages, { base: path.app.jade_pages })
			.pipe(watch(path.app.jade_pages, { base: path.app.jade_pages }));
	}

	res.pipe(jade({
			pretty: ! argv.prod
		}))
		.pipe(gulp.dest(config.distBase))
		.pipe(browserSync.reload({stream:true}));

	if ( ! watcher)
		return res;
}


/*--------------------------------------------------------
| Post production CSS task
--------------------------------------------------------*/
function postProdCssTask(watcher) {
	var res = gulp.src(path.watch.distCss);

	if (watcher) {
		res = gulp.src(path.watch.distCss, { base: path.dist.css })
				.pipe(watch(path.dist.css, { base: path.dist.css }));
	}

	res.pipe(autoprefixer({
			browsers: config.autoprefixer
		}))
		.pipe(gulpif(argv.prod, minifyCss()))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.stream());

	if ( ! watcher)
		return res;
}


/*--------------------------------------------------------
| Javascript copy task
--------------------------------------------------------*/
function javascriptCopyTask(watcher) {
	var res = gulp.src(path.watch.js);

	if (watcher) {
		res = gulp.src(path.watch.js, { base: path.app.js })
			.pipe(watch(path.app.js, { base: path.app.js }));
	}

	res.pipe(gulpif(argv.prod, jsmin()))
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.stream());

	if ( ! watcher)
		return res;
}


/*--------------------------------------------------------
| Images copy task
--------------------------------------------------------*/
function imagesCopyTask(watcher) {
	var res = gulp.src(path.watch.images);

	if (watcher) {
		res = gulp.src(path.watch.images, { base: path.app.images })
			.pipe(watch(path.app.images, { base: path.app.images }));
	}

	res.pipe(gulp.dest(path.dist.images));

	if ( ! watcher)
		return res;
}


/*--------------------------------------------------------
| Fonts task
--------------------------------------------------------*/
function fontsCopyTask(watcher) {
	var res = gulp.src(path.watch.fonts);

	if (watcher) {
		res = gulp.src(path.watch.fonts, { base: path.app.fonts })
			.pipe(watch(path.app.fonts, { base: path.app.fonts }));
	}

	res.pipe(gulp.dest(path.dist.fonts));

	if ( ! watcher)
		return res;
}


/*--------------------------------------------------------
| Misc files task
--------------------------------------------------------*/
function miscCopyTask(watcher) {
	var res = gulp.src(config.appBase + '/*.{ico,png,txt}');

	if (watcher) {
		res = gulp.src(config.appBase + '/*.{ico,png,txt}', { base: config.appBase })
			.pipe(watch(config.appBase, { base: config.appBase }));
	}

	res.pipe(gulp.dest(config.distBase));

	if ( ! watcher)
		return res;
}


/*--------------------------------------------------------
| Tasks from functions
--------------------------------------------------------*/
gulp.task('jade', function(){ return jadeTask() });
gulp.task('jade-watch', function(){ jadeTask(true) });

gulp.task('postProdCss', function(){ return postProdCssTask() });
gulp.task('postProdCss-watch', function(){ postProdCssTask(true) });

gulp.task('javascript:copy', function(){ return javascriptCopyTask() });
gulp.task('javascript:copy-watch', function(){ javascriptCopyTask(true) });

gulp.task('images:copy', function(){ return imagesCopyTask() });
gulp.task('images:copy-watch', function(){ imagesCopyTask(true) });

gulp.task('fonts', function(){ return fontsCopyTask() });
gulp.task('fonts-watch', function(){ fontsCopyTask(true) });

gulp.task('misc', function(){ return miscCopyTask() });
gulp.task('misc-watch', function(){ miscCopyTask(true) });


/*--------------------------------------------------------
 | Tinypng task
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
| Compass (sass) task
--------------------------------------------------------*/
gulp.task('compass', function() {
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
		.pipe(gulp.dest(path.dist.css));
});


/*--------------------------------------------------------
| Javascript concat tasks
--------------------------------------------------------*/
function concatJsTask(file) {
	gulp.task('javascript:concat:' + file, function() {
		return gulp.src(concatJsFiles[file])
			.pipe(concat(file + '.js'))
			.pipe(gulpif(argv.prod, jsmin()))
			.pipe(gulp.dest(path.dist.js))
			.pipe(browserSync.stream());
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
| Clear task
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
| Build task
--------------------------------------------------------*/
var javascriptTask = Object.keys(concatJsFiles).length ? 'javascript:concat' : 'javascript:copy';

gulp.task('build', function() {
	runSequence(
		'clear',
		['fonts', 'images:copy', javascriptTask, 'jade', 'misc'],
		'compass',
		'postProdCss'
	);
});


/*--------------------------------------------------------
| Develop task
--------------------------------------------------------*/
gulp.task('default',
	[
		'images:copy-watch',
		'fonts-watch',
		javascriptTask + '-watch',
		'jade-watch',
		'postProdCss-watch',
		'misc-watch'
	],
	function() {
		browserSync.init({
			server: config.distBase
		});

		gulp.watch(path.watch.scss, ['compass']);
	}
);