import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import mjml from 'gulp-mjml';
import notify from 'gulp-notify';
import imagemin from 'gulp-imagemin';

const paths = {
  dist: 'dist/',
  src: 'src/',
  images: {
    get src () { return `${paths.src}assets/images/*.*`; },
    get dist () { return `${paths.dist}assets/images/`; }
  }
};

const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: { baseDir: paths.dist },
    ui: false,
    open: false,
    reloadOnRestart: true,
    notify: false
  });
  done();
}

const clean = () => del([paths.dist]);

const images = () => {
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dist))
};

const build = () => {
  return gulp.src(paths.src + 'index.mjml')
    .pipe(mjml())
    .on('error', notify.onError())
    .pipe(gulp.dest(paths.dist))
};

const watch = () => {
  gulp.watch(paths.src, gulp.series(build, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
}

const dev = gulp.series(clean, build, images, serve, watch);

export default dev;
