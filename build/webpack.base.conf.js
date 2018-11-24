'use strict'
const { resolvePath, ...utils } = require('./utils')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    context: resolvePath('/'),
    entry: {
        app: resolvePath('/src/main.js'),
        foo: resolvePath('/src/main.js')
    },
    resolve: {
        extensions: ['.js', '.json', '.css'],
        alias: {
            '@': resolvePath('/src')
        }
    },
    module: {
        rules: [
            // eslint
            {
                test: /\.(js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolvePath('src')],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    failOnError: true
                }
            },
            // babel
            {
                test: /\.(js)$/,
                loader: 'babel-loader',
                include: resolvePath('src')
            },
            // image file loader
            utils.assetsLoader({
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                dir: 'img'
            }),
            // video and sound file loader
            utils.assetsLoader({
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                dir: 'media'
            }),
            // font file loader
            utils.assetsLoader({
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                dir: 'fonts'
            })
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: resolvePath('/static'),
            to: resolvePath('/dist/static'),
            ignore: ['.*']
        }])
    ]
}
