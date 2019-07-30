const isProduction = process.env.NODE_ENV === "production"; // сохраняем в константу значение переменной окружения Node.js NODE_ENV

const config = { // конфигурация Webpack
    mode: isProduction ? "production" : "development", // определяем режим запуска в зависимости от NODE_ENV

    entry: { // точка входа
        app: "./app/common/scripts/app.js"
    },
    output: { // точка выхода
        filename: "[name].min.js"
    },

    devtool: isProduction ? false : "source-map", // настройка генерации sourcemap в зависимости от NODE_ENV

    module: { // укажем loader для *.js файлов
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};

module.exports = config; // экспортируем обект config, чтобы в дальнейшем импортировать в gulpfile.js