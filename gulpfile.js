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
| Task factory function
--------------------------------------------------------*/
function taskFactory(src, destPath, callback, watchBase, bSync)
{
	callback = callback || function(res) { return res; };

	var res = gulp.src(src);

	if (watchBase)
		res = gulp.src(src, { base: watchBase })
			.pipe(watch(src, { base: watchBase }));

	res = callback(res);

	res.pipe(gulp.dest(destPath));

	if (bSync)
		res.pipe(bSync);

	if ( ! watchBase)
		return res;
}


/*--------------------------------------------------------
 | Test gulp task
 --------------------------------------------------------*/
gulp.task('hello', function() {
	console.log('Hello! Everything is OK!');
});


/*--------------------------------------------------------
| Jade task
--------------------------------------------------------*/
var jadeCallback = function(res) {
	return res.pipe(jade({
		pretty: ! argv.prod
	}));
};

gulp.task('jade', function() {
	return taskFactory(path.watch.jade_pages, config.distBase, jadeCallback);
});

gulp.task('jade-watch', function() {
	taskFactory(path.watch.jade_pages, config.distBase, jadeCallback, path.app.jade_pages, browserSync.reload({stream:true}));
});


/*--------------------------------------------------------
| Javascript copy task
--------------------------------------------------------*/
var javascriptCopyCallback = function(res) {
	return res.pipe(gulpif(argv.prod, jsmin()));
};

gulp.task('javascript:copy', function() {
	return taskFactory(path.watch.js, path.dist.js, javascriptCopyCallback);
});

gulp.task('javascript:copy-watch', function() {
	taskFactory(path.watch.js, path.dist.js, javascriptCopyCallback, path.app.js, browserSync.stream());
});


/*--------------------------------------------------------
| Images copy task
--------------------------------------------------------*/
gulp.task('images:copy', function() {
	return taskFactory(path.watch.images, path.dist.images);
});

gulp.task('images:copy-watch', function() {
	taskFactory(path.watch.images, path.dist.images, null, path.app.images);
});


/*--------------------------------------------------------
| Fonts task
--------------------------------------------------------*/
gulp.task('fonts', function() {
	return taskFactory(path.watch.fonts, path.dist.fonts);
});

gulp.task('fonts-watch', function() {
	taskFactory(path.watch.fonts, path.dist.fonts, null, path.app.fonts);
});


/*--------------------------------------------------------
| Extras files task
--------------------------------------------------------*/
gulp.task('extras', function() {
	return taskFactory([config.appBase + '/*.{ico,png,txt}', config.appBase + '/.htaccess'], config.distBase);
});

gulp.task('extras-watch', function() {
	taskFactory([config.appBase + '/*.{ico,png,txt}', config.appBase + '/.htaccess'], config.distBase, null, config.appBase);
});


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
		.pipe(autoprefixer({
			browsers: config.autoprefixer
		}))
		.pipe(gulpif(argv.prod, minifyCss()))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.stream());
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
		['fonts', 'images:copy', javascriptTask, 'jade', 'extras'],
		'compass'
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
		'extras-watch'
	],
	function() {
		browserSync.init({
			server: config.distBase
		});

		gulp.watch(path.watch.scss, ['compass']);
	}
);