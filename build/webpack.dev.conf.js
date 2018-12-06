'use strict'
const { resolvePath, ...utils } = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

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
            // style loaders
            ...utils.styleLoaders({})
        ]
    },
    plugins: [
        // global variable
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
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
        port: process.env.PORT || 8080
    }, (err, port) => {
        if (err) {
            reject(err)
        } else {
            process.env.PORT = port
            config.devServer.port = port
            config.plugins.push(
                // notify on errors
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${config.devServer.host}:${config.devServer.port}`
                        ]
                    },
                    onErrors: utils.notifyOnError
                }))
            resolve(config)
        }
    })
})
