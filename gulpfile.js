/* eslint-env es6, node */
'use strict';

const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' );
const postcss = require( 'gulp-postcss' );
const autoprefixer = require( 'autoprefixer' );
const eslint = require( 'gulp-eslint' );
const del = require( 'del' );
const imageOptim = require( 'gulp-imagemin' );
const changed = require( 'gulp-changed' );
const browserify = require( 'browserify' );
const source = require( 'vinyl-source-stream' );
const paths = {
  styles : 'src/assets/scss',
  scripts : 'src/assets/js',
  fonts : 'src/assets/fonts',
  images : 'src/assets/images',
  components: 'src/components',
  allSrc: 'src',
  drop : 'public'
};

gulp.task( 'fractal:start', function(){
  const fractal = require( './fractal.js' );
  const logger = fractal.cli.console;
  const server = fractal.web.server({ sync: true });

  server.on( 'error', err => logger.error( err.message ) );
  return server.start().then( () => {
    logger.success( `Fractal server is now running at ${server.urls.sync.local}` );
  });
});

gulp.task( 'fractal:build', function(){
  const fractal = require( './fractal.js' );
  const logger = fractal.cli.console;
  const builder = fractal.web.builder();

  builder.on( 'progress', ( completed, total ) => logger.update( `Exported ${completed} of ${total} items`, 'info' ) );
  builder.on( 'error', err => logger.error( err.message ) );
  return builder.build().then( () => {
    logger.success( 'Fractal build completed!' );
  });
});

gulp.task( 'lint', function() {
  return gulp.src([paths.scripts + '/**/*.js'])
    .pipe( eslint( { 'configFile': './.eslintrc.yml' } ) )
    .pipe( eslint.format() );
});

gulp.task( 'lint:watch', function() {
  gulp.watch([paths.scripts + '/**/*.js'], gulp.series( 'lint' ) );
});

 // SCSS -> CSS
gulp.task( 'css:process', function() {
  const logger = console;

  return gulp.src( paths.styles + '/**/*.scss' )
    .pipe( sass() )
    .on( 'error', function( err ) {
      logger.error( err.message );
      this.emit( 'end' );
    })
    .pipe( postcss([autoprefixer({ browsers: ['last 2 versions'] })]) )
    .pipe( gulp.dest( paths.drop + '/css' ) );
});

gulp.task( 'css:clean', function() {
  return del([paths.drop + '/css']);
});

gulp.task( 'css:watch', function() {
  gulp.watch(['src/**/*.scss'], gulp.series( 'css' ) );
});

gulp.task( 'css', gulp.series( 'css:clean', 'css:process' ) );

// Images

gulp.task( 'images:optimise', function() {
  return gulp.src( paths.images + '/**/*.+(svg|gif|png|jpg)' )
    .pipe ( changed( paths.drop + '/images' ) )
    .pipe( imageOptim() )
});

gulp.task( 'images:copy', function() {
  return gulp.src( paths.images + '/**/*' )
    .pipe( gulp.dest( paths.drop + '/images' ) );
});

gulp.task( 'images:clean', function( done ) {
  return del([paths.drop + '/images'], done );
});

gulp.task( 'images', gulp.series( 'images:optimise', 'images:copy' ) );

gulp.task( 'images:watch', function() {
  gulp.watch( paths.images + '/**/*', gulp.parallel( 'images' ) );
});


// Fonts
gulp.task( 'fonts:copy', function() {
  return gulp.src( paths.fonts + '/**/*' )
    .pipe( gulp.dest( paths.drop + '/fonts' ) );
});

gulp.task( 'fonts:clean', function( done ) {
  return del([paths.drop + '/fonts'], done );
});

gulp.task( 'fonts', gulp.series( 'fonts:clean', 'fonts:copy' ) );

gulp.task( 'fonts:watch', function() {
  gulp.watch( paths.fonts + '/**/*', gulp.parallel( 'fonts' ) );
});

// just copy for now, concatenating and minifying will happen at a later stage
gulp.task( 'js:copy', function() {
  return gulp.src( [ paths.scripts + '/polyfills.js' ] )
    .pipe( gulp.dest( paths.drop + '/js' ) );
});

gulp.task( 'js:clean', function( done ) {
  return del([paths.drop + '/js'], done );
});

gulp.task( 'js:browserify', function() {
  return browserify( paths.scripts + '/main.js', {
    // paths in which to look for modules
    'paths' : [
      paths.components,
      paths.scripts
    ]
  })
    .bundle()
    .pipe( source('main.js') )
    .pipe( gulp.dest( paths.drop + '/js' ) );
});

gulp.task( 'js', gulp.series( 'js:clean', 'js:browserify', 'js:copy' ) );

gulp.task( 'js:watch', function() {
  gulp.watch( paths.allSrc + '/**/*.js', gulp.parallel( 'js' ) );
});

gulp.task( 'default', gulp.parallel( 'css', 'images', 'fonts', 'js' ) );
gulp.task( 'fractal-build', gulp.series( 'css', 'images', 'fonts', 'js', 'fractal:build' ) );
gulp.task( 'watch', gulp.parallel( 'lint:watch', 'css:watch', 'js:watch', 'images:watch', 'fonts:watch' ) );
gulp.task( 'clean', gulp.parallel( 'css:clean', 'images:clean', 'fonts:clean', 'js:clean' ) );
gulp.task( 'dev', gulp.series( 'default', 'fractal:start', 'watch' ) );
