/* eslint-env es6, node */
'use strict';

const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' );
const postcss = require( 'gulp-postcss' );
const concat = require( 'gulp-concat' );
const packagejson = require( './package.json' );
const minify = require('gulp-minifier');
const autoprefixer = require( 'autoprefixer' );
const eslint = require( 'gulp-eslint' );
const del = require( 'del' );
const imageOptim = require( 'gulp-imagemin' );
const changed = require( 'gulp-changed' );
const header = require( 'gulp-header' );
const rename = require( 'gulp-rename' );
const change = require( 'gulp-change' );
const cleancss = require('gulp-clean-css');
var replace = require('gulp-replace');
const paths = {
  styles : 'src/assets/scss',
  scripts : 'src/assets/js',
  fonts : 'src/assets/fonts',
  images : 'src/assets/images',
  components: 'src/@koop-componenten',
  allSrc: 'src',
  drop : 'public',
  dist : 'dist',
  designsystem : 'designsystem',
  componentlibrary: 'component-library'
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

gulp.task( 'fractal:start-twig', function(){

  // Twig adapter
  const twigAdapter = require('@frctl/twig')({
    importContext: true
  });

  // Fractal
  const fractal = require( './fractal.js' );
  fractal.components.engine(twigAdapter);
  fractal.components.set('ext', '.twig');
  const logger = fractal.cli.console;
  const server = fractal.web.server({
    sync: true,
    port: 4000
  });

  server.on( 'error', err => logger.error( err.message ) );
  return server.start().then( () => {
    logger.success( `Fractal server is now running at ${server.urls.sync.local}` );
  });
});

gulp.task( 'fractal:build', function(){
  const fractal = require( './fractal_build.js' );
  const logger = fractal.cli.console;
  const builder = fractal.web.builder();

  builder.on( 'progress', ( completed, total ) => logger.update( `Exported ${completed} of ${total} items`, 'info' ) );
  builder.on( 'error', err => logger.error( err.message ) );
  return builder.build().then( () => {
    logger.success( 'Fractal build completed!' );
  });
});

gulp.task( 'lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe( eslint( { 'configFile': './.eslintrc.yml' } ) )
    .pipe( eslint.format() );
});

gulp.task( 'lint:watch', function() {
  gulp.watch(['src/**/*.js'], gulp.series( 'lint' ) );
});

 // SCSS -> CSS
gulp.task( 'css:process', function() {
  const logger = console;

  return gulp.src( paths.styles + '/*.scss' )
    .pipe( sass() )
    .on( 'error', function( err ) {
      logger.error( err.message );
      this.emit( 'end' );
    })
    .pipe( postcss([autoprefixer({ browsers: ['last 2 versions'] })]) )
    .pipe( cleancss ({ compatibility: 'ie8' }) )
    .pipe( replace('@charset "UTF-8";', ''))
    .pipe( header( '@charset "UTF-8";/* Package version: <%= version %>, "<%= name %>". */\n', { version: packagejson.version, name: packagejson.name }) )
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

// Dist - dist folder (= copy of 'public' folder)
gulp.task( 'dist:clean', function() {
  return del([paths.dist]);
});
gulp.task( 'dist:copypublic', function() {
  return gulp.src( paths.drop + '/**/*' )
    .pipe( gulp.dest( paths.dist ) );
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

gulp.task( 'js:clean', function( done ) {
  return del([paths.drop + '/js'], done );
});

gulp.task( 'js:copy', function() {
  return gulp.src( paths.scripts + '/vendor/kpm.js' )
    .pipe( gulp.dest( paths.drop + '/js/vendor/' ) );
});

gulp.task( 'js:build', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js', // 3.5.1
    paths.scripts + '/vendor/jquery-ui.min.js', // 1.2
    paths.scripts + '/vendor/fastsearch.js',
    paths.scripts + '/vendor/fastselect.js',
    paths.scripts + '/vendor/moment.js',
    paths.scripts + '/vendor/highlight.pack.js', // 10.3.2
    paths.scripts + '/vendor/stickybit.min.js',
    paths.scripts + '/vendor/jquery-autocomplete.js',
    paths.scripts + '/vendor/validityState.polyfill.js',
    paths.scripts + '/polyfills.js',
    paths.scripts + '/main.js',
    paths.components + '/**/*.js',
    '!' + paths.components + '/**/*.e2e.js',
    paths.scripts + '/decorators/*.js',
    paths.scripts + '/run.js'
  ])
  .pipe( concat( 'main.js' ) )
  .pipe(minify({
    minify: true,
    minifyJS: {
      sourceMap: false
    },
  }))
  .pipe( header( '/* Package version: <%= version %>, "<%= name %>". */\n', { version: packagejson.version, name: packagejson.name }) )
  .pipe( gulp.dest( paths.drop + '/js' ) );
});

gulp.task( 'js', gulp.series( 'js:clean', 'js:build', 'js:copy' ) );

gulp.task('ds:clean', function (done) {
  return del([paths.designsystem], done);
});

gulp.task('ds:copypublic', function () {
  return gulp.src(paths.drop + '/**/*')
    .pipe(gulp.dest(paths.designsystem));
});
gulp.task('ds:copytemplates', function () {
  return gulp.src([
    paths.componentlibrary + '/components/preview/templates-ds---rationale.html',
    paths.componentlibrary + '/components/preview/templates-ds---componenten.html',
    paths.componentlibrary + '/components/preview/templates-ds---content.html',
    paths.componentlibrary + '/components/preview/templates-ds---homepage.html',
    paths.componentlibrary + '/components/preview/templates-ds---ontwerpprincipes.html',
    paths.componentlibrary + '/components/preview/templates-ds---templates.html',
    paths.componentlibrary + '/components/preview/templates-ds---toelichting.html'
  ])
    .pipe(gulp.dest(paths.designsystem + '/html/templates/'));
});

gulp.task('ds:rename', function () {
  gulp.src(paths.designsystem + '/html/templates/templates-ds---rationale.html')
    .pipe(rename('/html/templates/rationale.html'))
    .pipe(gulp.dest(paths.designsystem));
  gulp.src(paths.designsystem + '/html/templates/templates-ds---componenten.html')
    .pipe(rename('/html/templates/componenten.html'))
    .pipe(gulp.dest(paths.designsystem));
  gulp.src(paths.designsystem + '/html/templates/templates-ds---content.html')
    .pipe(rename('/html/templates/content.html'))
    .pipe(gulp.dest(paths.designsystem));
  gulp.src(paths.designsystem + '/html/templates/templates-ds---homepage.html')
    .pipe(rename('/html/templates/index.html'))
    .pipe(gulp.dest(paths.designsystem));
  gulp.src(paths.designsystem + '/html/templates/templates-ds---ontwerpprincipes.html')
    .pipe(rename('/html/templates/ontwerpprincipes.html'))
    .pipe(gulp.dest(paths.designsystem));
  return gulp.src(paths.designsystem + '/html/templates/templates-ds---toelichting.html')
    .pipe(rename('/html/templates/toelichting.html'))
    .pipe(gulp.dest(paths.designsystem));
});

function performChange(content) {
    return content.replace(/(\.\.\/\.\.\/)/g, '').replace(/\btemplates-ds\b---/g, '');
}

gulp.task('ds:editfilepaths', function() {
  return gulp.src([
    paths.designsystem + '/html/templates/componenten.html',
    paths.designsystem + '/html/templates/content.html',
    paths.designsystem + '/html/templates/index.html',
    paths.designsystem + '/html/templates/ontwerpprincipes.html',
    paths.designsystem + '/html/templates/toelichting.html',
    paths.designsystem + '/html/templates/rationale.html',
    ])
    .pipe(change(performChange))
    .pipe(gulp.dest(paths.designsystem))
});

gulp.task('ds:removeoldtemplates', function (done) {
  return del([paths.designsystem + '/html'], done);
});

gulp.task('ds', gulp.series('ds:clean', 'ds:copypublic', 'ds:copytemplates', 'ds:rename', 'ds:editfilepaths', 'ds:removeoldtemplates'));

gulp.task( 'js:watch', function() {
  gulp.watch( paths.allSrc + '/**/*.js', gulp.parallel( 'js' ) );
});

gulp.task( 'default', gulp.parallel( 'css', 'images', 'fonts', 'js' ) );
gulp.task( 'dist-build', gulp.series( 'default', 'dist:clean', 'dist:copypublic' ) );

gulp.task( 'fractal-build', gulp.series( 'css', 'images', 'fonts', 'js', 'fractal:build', 'ds' ) );
// gulp.task( 'watch', gulp.parallel( 'lint:watch', 'css:watch', 'js:watch', 'images:watch', 'fonts:watch' ) );
gulp.task( 'watch', gulp.parallel( 'css:watch', 'js:watch', 'images:watch', 'fonts:watch' ) );
gulp.task( 'clean', gulp.parallel( 'css:clean', 'images:clean', 'fonts:clean', 'js:clean' ) );
gulp.task( 'dev', gulp.series( 'default', 'fractal:start', 'watch' ) );
gulp.task( 'dev-twig', gulp.series( 'default', 'fractal:start-twig', 'watch' ) );
