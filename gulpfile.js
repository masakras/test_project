 /*------------------------------------*\
        #require
\*------------------------------------*/

var gulp       = require('gulp'),

        msts       = require('gulp-minify-css'),
        sass       = require('gulp-sass'),
        prsts      = require('gulp-autoprefixer'),

        msct       = require('gulp-uglify'),
        browserify = require('browserify'),
        reactify   = require('reactify'),

        rimraf     = require('rimraf'),
        rename     = require('gulp-rename'),
        watch      = require('gulp-watch'),

        brsync     = require('browser-sync'),
        reload     = brsync.reload,
        pug        = require('gulp-pug'),

        imagemin   = require('gulp-imagemin'),
        pngquant   = require('imagemin-pngquant'),
        cache      = require('gulp-cache');

var paths = {

    dist:{
        html:'./dist',
        css:'./dist/css/',
        js:'./dist/js/',
        img:'./dist/img/',
        font:'./dist/fonts/',
        lib:'./dist/libs/'
    },

    src:{
        html:'src/**.*html',
        pug:'src/pug/**.*pug',
        css:'src/sass/*.scss',
        js:'src/scripts/index.js',
        img:'src/img/**/*.*',
        font:'src/fonts/**/*.*',
        lib:'src/libs/**/*.*'
    },

    watch:{
        html:'src/**.*html',
        pug:'src/pug/*.pug',
        css:'src/sass/**/*.*',
        js:'src/js/**/*.*',
        img:'src/img/**/*.*',
        font:'src/fonts/**/*.*'
    },

    clean:'./dist/'
};

/*------------------------------------*\
        #config server
\*------------------------------------*/

var conf = {
    server:{
        baseDir:'./dist/'
    },
    tunnel:false,
    host:'localhost',
    port:8080,
    logPrefix:'Example'
};

/*------------------------------------*\
        #tasks
\*------------------------------------*/

// #server
gulp.task('server', function () {
        brsync(conf);
});

//#pug
gulp.task('pug', function (){
    return gulp.src(paths.src.pug)
        .pipe(pug())
        .pipe(gulp.dest('src'))
        .pipe(reload({stream: true}));
});

// #html
gulp.task('html', ['pug'], function () {
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dist.html))
        .pipe(reload({stream: true}));
});

// #sass
gulp.task('style', function () {
    return gulp.src(paths.src.css)
        .pipe(sass({
        }).on('error',sass.logError))
        .pipe(prsts({
                browsers: ['last 10 versions'],
                cascade: false
        }))
        .pipe(msts())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(reload({stream: true}));
});

//image
gulp.task('img', function() {
        return gulp.src(paths.src.img)
            .pipe(cache(imagemin({ 
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            })))
            .pipe(gulp.dest(paths.dist.img)); 
    });

// #js
gulp.task('js',function(){
    return browserify(paths.src.js, { debug: true })
        .transform(reactify)
        .bundle()
        .pipe(msct())
        .pipe(gulp.dest(paths.dist.js))
        .pipe(reload({stream: true}));
});

// #libs
gulp.task('libs',function(){
    return gulp.src(paths.src.lib)
        .pipe(gulp.dest(paths.dist.lib));
});

// #clean
gulp.task('clean', function (cb) {
        rimraf(paths.clean, cb);
});

// #build
gulp.task('build', [
        'pug',        
        'style',
        'img',
        'libs',
        'html'                
        // 'js'
]);

// #watch
gulp.task('watch', function(){
        gulp.watch(paths.watch.pug, ['pug']);        
        gulp.watch(paths.watch.css,['style']);
        gulp.watch(paths.watch.js,['js']); 
        gulp.watch(paths.watch.html,['html']);       
});

// #default
gulp.task('default', ['build', 'server', 'watch']);