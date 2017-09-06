/* eslint-env es6, node */
'use strict';
const fractal = require( '@frctl/fractal' ).create();
const hbs = require( '@frctl/handlebars' )( {} );
const handlebars = fractal.components.engine( hbs ).handlebars;

const mandelbrot = require('@frctl/mandelbrot');
const myCustomisedTheme = mandelbrot({
    skin: "olive"
});

fractal.set( 'project.title', 'KOOP componentenbibliotheek' );
fractal.components.set( 'path', `${__dirname}/src/components` );
fractal.components.set( 'default.preview', '@preview.default' );
fractal.components.set( 'default.display', { 'padding': '1em' });
fractal.components.set( 'ext', '.handlebars' );
fractal.docs.set( 'path', `${__dirname}/src/docs` );
fractal.web.set( 'builder.dest', `${__dirname}/component-library` );
fractal.web.set( 'static.path', `${__dirname}/public` );
fractal.web.theme(myCustomisedTheme);


module.exports = fractal;
