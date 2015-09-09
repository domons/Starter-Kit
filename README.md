# It is not finished yet!

# Starter-Kit
Ground zero for your next project using [Compass](http://compass-style.org/), [Jade](http://jade-lang.com/) and [Gulp.js](http://gulpjs.com/).

## Features
- Compile jade
- Compile Sass/Scss files using Compass
- Autoprefixer CSS
- BrowserSync
- Minify HTML, CSS, JavaScript
- Concat CSS, JavaScript
- Compress images using tinypng.com


## How to install
- If you haven't [Node.js](https://nodejs.org/en/) and [Compass](http://compass-style.org/) with Ruby on your computer, install it.
- Run `git clone https://github.com/domons/Starter-Kit.git`
- Then `cd Starter-Kit`
- and `npm install gulp -g`
- and `npm install`
- **DONE**

## Configuration


## How to use

| Command       | Description   |
| ------------- | ------------- |
| `gulp hello`  | Checks if Gulp works |
| `gulp images:copy` | Copy app/images/ to dist/images/ |
| `gulp images:tinypng` | Compress images **from dist/images/** using tinypng.com |
| `gulp jade` | Compile jade files |
| `gulp compass` | Compile scss files |
| `gulp postProdCss` | Autoprefixer on dist/css/ files |
| `gulp postProdCss --prod` | Autoprefixer and minify on dist/css/ files |
| `gulp fonts` | Copy app/fonts/ to dist/fonts/ |
| `gulp clear` | Delete .sass-cache/ and whole dist/ directory |
| `gulp clear --noimg` | Delete .sass-cache/ and dist/ directory except dist/images/ |
| `gulp build` | Build project (dist/ directory) |
| `gulp build --prod` | Build project and minify html, css, js |
| `gulp` | Run dev environment - browser-sync and all necessary watchers |