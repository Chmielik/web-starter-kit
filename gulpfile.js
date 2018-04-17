const gulp = require('gulp');
const del = require('del')
const browserSync = require('browser-sync')
const runSequence = require('run-sequence')
const nodemon = require('gulp-nodemon')
const gulpLoadPlugins = require('gulp-load-plugins')
const BROWSER_SYNC_RELOAD_DELAY = 500
const $ = gulpLoadPlugins()

gulp.task('nodemon', (cb) => {
  let called = false
  return nodemon({
    script: 'app.js',
    watch: ['app.js']
  })
    .on('start', () => {
      if (!called) {
        cb()
      }
      called = true
    })
    .on('restart', () => {
      setTimeout(() => {
        browserSync.reload({
          stream: false
        })
      }, BROWSER_SYNC_RELOAD_DELAY)
    })
})

gulp.task('browser-sync', ['nodemon'], () => {
  return browserSync({
    proxy: 'http://localhost:3000',
    port: 7000,
    browser: 'google-chrome'
  })
})

gulp.task('bs-reload', () => {
  browserSync.reload()
})

gulp.task('clean', () => {
  return del(['dist/*', '!dist/.git'], { dot: true })
})

gulp.task('build', (callback) => {
  return runSequence('clean', ['html', 'scss', 'js'], callback)
})

gulp.task('js', () => {
  return gulp.src([
    // './node_modules/jquery/dist/jquery.min.js',
    './src/scripts/main.js',
  ])
    .pipe($.babel({
      presets: ['env']
    }))
    .pipe($.concat('main.js'))
    .pipe($.size({ title: 'scripts' }))
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.rename('main.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('scss', function () {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ]
  return gulp.src('src/styles/*.scss')
    .pipe($.sass({
      precision: 10
    })
    .on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.if('*.css', $.cssnano({
      discardComments: { removeAll: true }
    })))
    .pipe($.size({ title: 'css' }))
    .pipe(gulp.dest('dist/styles'))
})

gulp.task('css', () => {
  return gulp.src('dist/styles/*.css')
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('html', () => {
  return gulp.src('src/views/*.html')
    .pipe($.useref({
      searchPath: '{src}',
      noAssets: true
    }))
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe($.if('*.html', $.size({ title: 'html', showFiles: true })))
    .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['build', 'browser-sync'], () => {
  gulp.watch('src/views/*.html', ['html'])
  gulp.watch('src/styles/*.scss', ['scss'])
  gulp.watch('src/scripts/*.js', ['js'])
  gulp.watch('dist/*.html', ['bs-reload'])
  gulp.watch('dist/styles/*.css', ['css'])
  gulp.watch('dist/scripts/*.js', ['bs-reload'])
})
