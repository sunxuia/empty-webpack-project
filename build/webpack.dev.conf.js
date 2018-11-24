'use strict'
const { resolvePath, ...utils } = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    // webpack-dev-server
    devServer: {
        port: 8080,
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
            'process.env': 'development'
        }),
        // create index.html
        new HtmlWebpackPlugin({
            template: resolvePath('/index.html'),
        }),
        // hot replacement for webpack-dev-server
        new webpack.HotModuleReplacementPlugin(),
    ]
})
