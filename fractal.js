/* eslint-env es6, node */
'use strict';
const fractal = require( '@frctl/fractal' ).create();

// Twig adapter
const twigAdapter = require('@frctl/twig')();
fractal.components.engine(twigAdapter);
fractal.components.set('ext', '.twig');

const mandelbrot = require('@frctl/mandelbrot');
const myCustomisedTheme = mandelbrot({
    skin: "olive"
});

fractal.set( 'project.title', 'KOOP componentenbibliotheek' );
fractal.components.set( 'path', `${__dirname}/src` );
fractal.components.set( 'default.preview', '@preview.default' );
fractal.web.set( 'builder.dest', `${__dirname}/component-library` );
fractal.web.set( 'static.path', `${__dirname}/public` );
fractal.web.theme(myCustomisedTheme);

module.exports = fractal;
