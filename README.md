# It is not finished yet!

# Starter-Kit
Ground zero for your next project using [Compass](http://compass-style.org/), [Jade](http://jade-lang.com/) and [Gulp.js](http://gulpjs.com/).

## Features
- Compiles jade
- Compiles Sass/Scss files using Compass
- Autoprefixer CSS
- BrowserSync
- Minify HTML, CSS, JavaScript
- Concat CSS, JavaScript
- Compresses images using tinypng.com


## How to install
- If you haven't [Node.js](https://nodejs.org/en/) and [Compass](http://compass-style.org/) with Ruby on your computer, install it.
- Run `git clone https://github.com/domons/Starter-Kit.git`
- Then `cd Starter-Kit`
- and `npm install gulp -g`
- and `npm install`
- **DONE**

## Configuration
#### TinyPng Api Key
Get your api key from [here](https://tinypng.com/developers) and set it in **config.tinypngApiKey**

#### Autoprefixer in CSS
You can set browsers for autoprefixer in **config.autoprefixer**.

Example `['last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']`

#### JavaScript concat files
Example concatJsFiles object:
```
concatJsFiles = {
	result_file_name: [
		path.app.js + '/files.js',
		path.app.js + '/to.js',
		path.app.js + '/concat.js'
	],
	other_file: [
		path.app.js + 'any.js',
		path.app.js + 'file.js'
	]

	//or_all_files: [
	//	path.app.js + '*.js'
	//]
}
```
If you set empty object `concatJsFiles = { }` all *.js will be copied from app/js to dist/js with the same names.

## How to use

| Command       | Description   |
| ------------- | ------------- |
| `gulp hello`  | Checks if Gulp works |
| `gulp images:copy` | Copying app/images/ to dist/images/ |
| `gulp images:tinypng` | Compresses images **from dist/images/** using tinypng.com |
| `gulp jade` | Compiles jade files |
| `gulp compass` | Compiles scss files |
| `gulp postProdCss` | Autoprefixer on dist/css/ files |
| `gulp postProdCss --prod` | Autoprefixer and minify on dist/css/ files |
| `gulp fonts` | Copying app/fonts/ to dist/fonts/ |
| `gulp clear` | Removing .sass-cache/ and whole dist/ directory |
| `gulp clear --noimg` | Removing .sass-cache/ and dist/ directory except dist/images/ |
| `gulp build` | Build project (dist/ directory) |
| `gulp build --prod` | Build project and minify html, css, js |
| `gulp` | Run dev environment - browser-sync and all watchers |