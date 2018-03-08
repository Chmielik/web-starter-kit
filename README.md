#  What's here

This starter kit uses browserSync for livereloading client-side files and nodemon for server-side.
Support for scss, autoprefixer, ES6. Builds minified versions for production

## Running

Run ```gulp``` to start

## Example details

1. Running ```gulp``` will start two server applications:
    * Our vanilla ExpressJS server at http://localhost:3000
    * A proxied version of our ExpressJS server at http://localhost:7000 (This will be connected to ```browser-sync```)