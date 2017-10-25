var gulp = require('gulp')
var webserver = require('gulp-webserver');
var wiredep = require('wiredep').stream

gulp.task('webserver', function(){
    gulp.src('./')
        .pipe(webserver({
            port: 9000,
            host: '127.0.0.1',
            livereload: true,
            open: true
        }))
})

gulp.task('wiredep', function(){
    return gulp.src('./*.html')
        .pipe(wiredep({
            exclude:['bootstrap.js'],
            ignorePath:/^(\.\.\/)*.\.\./
        }))
        .pipe(gulp.dest('./'))
})

gulp.task('dev', ['wiredep' , 'webserver'], function(){
    
})