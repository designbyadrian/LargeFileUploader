(function gulpTasks() {
    'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sassLint = require('gulp-sass-lint'),
	minifyCSS = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	neat = require('node-neat').includePaths,
	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	sequence = require('gulp-sequence'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	queue = require('streamqueue'),
	paths = {
		root: 	'./app',
		js: 	'./assets/js',
		sass: 	'./assets/sass',
		mainJS: './assets/js/main.js',
		mainSASS: './assets/sass/main.sass'
	},
	sassVendors = [
		'./bower_components/normalize-scss/',
		'./bower_components/font-awesome/scss/'
	],
	jsVendors = [
		'./bower_components/angular/angular.min.js',
		'./bower_components/angular-route/angular-route.min.js',
		'./bower_components/angular-sanitize/angular-sanitize.min.js',
		'./bower_components/angular-animate/angular-animate.min.js',
		'./bower_components/moment/min/moment.min.js',
		'./bower_components/angular-moment/angular-moment.min.js',
		'./bower_components/ng-file-upload/ng-file-upload.min.js',
		'./bower_components/angular-svg-round-progressbar/build/roundProgress.min.js'
	];

gulp.task('default', sequence('clean', ['styles','scripts'],'webserver','watch'));

gulp.task('clean',function(){

});

gulp.task('webserver',function(){
	console.log("werb server",paths.root);

	browserSync({
		proxy: 'lfu:8888',
		port: 8080,
		open: false
	});
});

gulp.task('watch',function(){
	gulp.watch(paths.sass+'/*.sass',['styles']);
	gulp.watch(paths.js+'/*.js',['scripts']);
});

gulp.task('styles', ['sass-lint', 'sass']);

gulp.task('sass-lint',function(){
	gulp
		.src(paths.mainSASS)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'Sass Lint Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sassLint({'config': 'lint.yml'}))
		.pipe(sassLint.format());
		//.pipe(sassLint.failOnError());
});

gulp.task('sass',function(){

	gulp.src(paths.mainSASS)
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'Sass Compile Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({
			style: 'compact',
			includePaths: neat.concat(sassVendors),
			sourceMap: true
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(minifyCSS())
		.pipe(rename('style.css'))
		.pipe(gulp.dest(paths.root))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.root))
		.pipe(notify({
			message: 'SASS complete'
		}))
		.pipe(browserSync.stream());
		//.pipe(connect.reload());
});



gulp.task('scripts', ['es-lint', 'js']);

gulp.task('es-lint',function(){
	gulp.src(paths.js+'/*.js')
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'JS Compile Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(eslint())
		.pipe(eslint.format());
		//.pipe(eslint.failAfterError());
});

gulp.task('js',function(){

	var concatStream = gulp.src(jsVendors),
		minStream = gulp.src(paths.js+'/*.js')
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: 'JS Compile Error',
					message: '<%= error.message %>',
					sound: 'Sosumi'
				})(err);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(uglify());

	return queue({objectMode:true},concatStream,minStream)
		.pipe(concat('script.min.js'))
		.pipe(gulp.dest(paths.root))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.root))
		.pipe(notify({
			message: 'JS complete'
		}))
		.pipe(browserSync.stream());
});

})();