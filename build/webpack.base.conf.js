'use strict'
const { resolvePath, ...utils } = require('./utils')
const config = require('./config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const baseConfig = {
    context: resolvePath('/'),
    entry: {},
    output: {
        publicPath: config.publicPath
    },
    resolve: {
        extensions: ['.js', '.json', '.css'],
        alias: {
            '@': resolvePath('/src')
        }
    },
    module: {
        rules: [
            // babel
            {
                test: /\.(js)$/,
                loader: 'babel-loader',
                include: resolvePath('src')
            },
            // image file loader
            utils.assetsLoader({
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                outputPath: 'img'
            }),
            // video and sound file loader
            utils.assetsLoader({
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                outputPath: 'media'
            }),
            // font file loader
            utils.assetsLoader({
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                outputPath: 'fonts'
            })
        ]
    },
    plugins: [
        // global variable
        new webpack.DefinePlugin({
            'process.env': {
                PUBLIC_PATH: JSON.stringify(config.publicPath),
                VARIABLES: JSON.stringify(config.variables)
            }
        }),
        // static files
        new CopyWebpackPlugin([{
            from: resolvePath('/static'),
            to: resolvePath('/dist/static'),
            ignore: ['.*']
        }])
    ]
}
// multipage
for (const pageName in config.pages) {
    const page = config.pages[pageName]
    baseConfig.entry[page.chunkName] = resolvePath(page.entry)
}

module.exports = baseConfig
