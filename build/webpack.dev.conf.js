'use strict'
const { resolvePath, ...utils } = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')

const config = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    // webpack-dev-server
    devServer: {
        port: process.env.PORT,
        host: 'localhost',
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true
    },
    module: {
        rules: [
            // css
            utils.styleLoader({
                test: /\.(css)$/,
                sourceMap: true
            }),
            // scss
            utils.styleLoader({
                test: /\.(scss)$/,
                loader: 'sass-loader',
                sourceMap: true,
            }),
            // sass
            utils.styleLoader({
                test: /\.(sass)$/,
                loader: 'sass-loader',
                sourceMap: true,
                indentedSyntax: true
            }),
        ]
    },
    plugins: [
        // global variable
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'development'
        }),
        // create index.html
        new HtmlWebpackPlugin({
            template: resolvePath('/index.html'),
            favicon: resolvePath('logo.png')
        }),
        // hot replacement for webpack-dev-server
        new webpack.HotModuleReplacementPlugin()
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.getPort({
        port: process.env.PORT || 8080,
    }, (err, port) => {
        if (err) {
            reject(err)
        } else {
            process.env.PORT = port
            config.plugins.push(
                // notify on errors
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${config.devServer.host}:${config.devServer.port}`
                        ]
                    },
                    onErrors: function (severity, errors) {
                        if (severity === 'error') {
                            const error = errors[0];
                            const filename = error.file.split('!').pop();
                            notifier.notify({
                                title: 'webpack build error',
                                message: severity + ': ' + error.name,
                                subtitle: filename || '',
                                icon: resolvePath('logo.png')
                            })
                        }
                    }
                }))
            resolve(config)
        }
    })
})
