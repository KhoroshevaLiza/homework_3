const gulp = require("gulp"); // импорт модулей
// const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");

// clear task
const del = require("del");

// pug task (templates)
const pug = require("gulp-pug");

// scss task (styles)
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const minifyCss = require("gulp-clean-css");

const isProduction = process.env.NODE_ENV === "production"; // значение переменной окружения Node.js NODE_ENV

// js (scripts)
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");

const webpackConfig = require("./webpack.config.js"); // импортируем файл webpack.config.js

// images
const imagemin = require("gulp-imagemin");

// copy
const copy = require("gulp-copy");

// server
const browserSync = require("browser-sync").create(); // импортируем и сразу вызываем метод create()

const PATHS = {
    app: "./app",
	dist: "./dist"
};

gulp.task("clear", () => del(PATHS.dist));

gulp.task("templates", () => {
    return gulp
        .src(`${PATHS.app}/pages/**/*.pug`, { //.src() - получаем источник
            since: gulp.lastRun("templates") 
        })
        .pipe(plumber()) // отслеживание ошибок
        .pipe(pug({ pretty: true })) // запрет сжатия HTML
        .pipe(gulp.dest(PATHS.dist)); // выходные файлы в папке 
});

gulp.task("styles", () => {
    return gulp
        .src(`${PATHS.app}/common/styles/**/*.scss`, { //
            since: gulp.lastRun("styles")
        })
        .pipe(plumber()) //
        .pipe(gulpIf(!isProduction, sourcemaps.init())) // если isProduction false то выполняем 
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulpIf(isProduction, minifyCss())) // сжатие
        .pipe(gulpIf(!isProduction, sourcemaps.write())) // запись файлов
        .pipe(gulp.dest(`${PATHS.dist}/assets/styles`)); //
});

gulp.task("scripts", () => {
	return gulp
		.src(`${PATHS.app}/common/scripts/*.js`, { 
            since: gulp.lastRun("scripts") 
        })
		.pipe(plumber())
		.pipe(gulpWebpack(webpackConfig, webpack))
		.pipe(gulp.dest(`${PATHS.dist}/assets/scripts`));
});

gulp.task("images", () => {
    return gulp
        .src(`${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`, { //
            since: gulp.lastRun("images")
        })
        .pipe(plumber()) //
        .pipe(gulpIf(isProduction, imagemin())) // если запускаем в production режиме (т.е. переменная isProduction true), то запустится минификация изображений imagemin(). В противном случае, если запустили сборку в режиме разработки, то минификация изображений нам не нужна
        .pipe(gulp.dest(`${PATHS.dist}/assets/images`)); //
});

// copy
gulp.task("copy", () => {
    return gulp
        .src (`${PATHS.app}/common/fonts/**/*`)
        .pipe(plumber())
        .pipe(gulp.dest(`${PATHS.dist}/assets/fonts`));
});

gulp.task("server", () => {
    browserSync.init({
        server: PATHS.dist
    });
    browserSync.watch(PATHS.dist + "/**/*.*").on("change", browserSync.reload);
});

gulp.task("watch", () => {
    gulp.watch(`${PATHS.app}/**/*.pug`, gulp.series("templates"));
    gulp.watch(`${PATHS.app}/**/*.scss`, gulp.series("styles"));
    gulp.watch(`${PATHS.app}/**/*.js`, gulp.series("scripts"));
    gulp.watch(
        `${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`,
        gulp.series("images")
    );
});

gulp.task("default",
    gulp.series(
        gulp.parallel("templates", "styles", "scripts", "images"),
        gulp.parallel("watch", "server")
    )
);

gulp.task("production",
    gulp.series("clear",
        gulp.parallel("templates", "styles", "scripts", "images")
    )
);