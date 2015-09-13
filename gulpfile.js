/*
* @author: Esteban Fuentealba <efuentealba@json.cl>
*/

var gulp        = require('gulp');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');

gulp.task("build-js", function () {
  gulp.src("./src/background.js")
    .pipe(browserify({
      transform: ['babelify']
    }))
    //.pipe(uglify())
    .pipe(gulp.dest("./build/"));
});
gulp.task("cp", function() {
  //gulp.src(["./src/background.js","./src/icon.png","./src/manifest.json","./src/popup.html"])
  gulp.src(["./src/icon-19x19.png","./src/manifest.json"])
    .pipe(gulp.dest('./build/'));
});
gulp.task('default', [ 'cp', 'build-js' ]);
