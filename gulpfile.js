const gulp = require('gulp');  
const sass = require('gulp-sass'); 
const htmlmin = require('gulp-htmlmin'); 
const cleanCSS = require('gulp-clean-css');
const autiprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps'); 
const browserSync = require('browser-sync');
const gulpSequence = require('gulp-sequence');
const wait = require('gulp-wait');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');

const path = {
    src: {
		html: 'src/index.html',
		images: 'src/assets/images/*',
		scss: 'src/scss/*.scss',
	},

	build: {
		images: 'assets/img',
		html: './',
		scss: './',
	},
	watch: {
		html: 'src/index.html',
		css: 'main.css',
		scss: 'src/scss/*/*.scss'
	},
	clean: {
		html: 'index.html',
	}
};

// Optimize images for web
gulp.task('build:images', () => {
	gulp.src(path.build.images, {read: false})
	.pipe(clean());

	return gulp.src(path.src.images)
	.pipe(imagemin([imagemin.optipng({optimizationLevel: 5})]))
	.pipe(gulp.dest(path.build.images));
});

//Minify HTML
gulp.task('build:html-dev', () => {
	//delet orevious
	gulp.src(path.clean.html, {read: false})
	.pipe(clean());

	return gulp.src(path.src.html)
	.pipe(gulp.dest(path.build.html));
});

//Minify HTML
gulp.task('build:html-prod', () => {
	//delet orevious
	gulp.src(path.clean.html, {read: false})
	.pipe(clean());

	return gulp.src(path.src.html)
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest(path.build.html));
});


//Build sass for production
gulp.task('build:sass-dev', function () {  
	return gulp.src(path.src.scss)
	.pipe(wait(1500))
	.pipe(sass())
	.pipe(autiprefixer())
	.pipe(gulp.dest(path.build.scss))
	.pipe(browserSync.stream());
});

//build sass for dev mod
gulp.task('build:sass-prod', function () {  
	return gulp.src(path.src.scss)
	.pipe(sass())
	.pipe(autiprefixer())
    .pipe(cleanCSS())
	.pipe(gulp.dest(path.build.scss));
});

//run browsersync
gulp.task('browser-sync', ['build:sass-dev'],  function() {  
    browserSync.init({
        server: {
            baseDir: "./"
        }
	});

	gulp.watch(path.watch.html, ['build:html-dev']).on('change', browserSync.reload);
	gulp.watch(path.watch.scss, ['build:sass-dev']);
});

gulp.task('dev-server', gulpSequence('build:sass-dev', 'build:html-dev', 'browser-sync'));
gulp.task('build', gulpSequence('build:sass-prod', 'build:html-dev'));
gulp.task('build-images', gulpSequence('build:images'));
