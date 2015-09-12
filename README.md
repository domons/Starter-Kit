# Starter-Kit

![Vilio Theme](/splash.jpg)

Ground zero for your next project using [Compass](http://compass-style.org/), [Jade](http://jade-lang.com/) and [Gulp.js](http://gulpjs.com/).

## Features
- Compiles Jade
- Compiles Sass/Scss files using Compass
- Autoprefixer CSS
- BrowserSync
- Minify HTML, CSS, JavaScript
- Concat CSS, JavaScript
- Image compression using tinypng.com

## How to install
- If you haven't [Node.js](https://nodejs.org/en/) and [Compass](http://compass-style.org/) with Ruby on your computer, install it.
- Run `git clone https://github.com/domons/Starter-Kit.git`
- Then `cd Starter-Kit`
- and `npm install gulp -g`
- and `npm install`
- **DONE**

## Configuration
#### TinyPng Api Key
Take api key from [here](https://tinypng.com/developers) and set it in **config.tinypngApiKey**

#### Autoprefixer in CSS
You can set browsers for autoprefixer in **config.autoprefixer**.

Example `['last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']`

#### JavaScript concat files
Example **concatJsFiles**:
```
concatJsFiles = {
	concat_file_name: [
		path.app.js + '/files.js',
		path.app.js + '/to.js',
		path.app.js + '/concat.js'
	],
	other_file: [
		path.app.js + '/any.js',
		path.app.js + '/file.js'
	]

	//or_all_files: [
	//	path.app.js + '/*.js'
	//]

	//or_all_files_and_one_first: [
	//	path.app.js + '/file.js',
	//	path.app.js + '/*.js'
	//]
}
```
If you set empty object `concatJsFiles = { }` all *.js will be copied from app/js to dist/js with the same names.

#### CSS concat files
Example **concatCssFiles**:
```
concatCssFiles = {
	vendors: [
		path.app.css + '/font-awesome.css',
		path.app.css + '/lightbox.css'
	]
}
```
The same way like in JavaScript concat.

**Warning!** You shouldn't use CSS here, which generates compass.

## How to use

| Command       | Description   |
| ------------- | ------------- |
| `gulp build` | Build project (generate dist/ directory) |
| `gulp build --prod` | Build project and minify html, css, js |
| `gulp` | Run dev environment (browser-sync and watchers) |
| `gulp clear` | Removing .sass-cache/ and whole dist/ directory |
| `gulp clear --noimg` | Removing .sass-cache/ and dist/ directory except dist/images/ |
| `gulp images:tinypng` | Compresses images **from dist/images/** using tinypng.com |
