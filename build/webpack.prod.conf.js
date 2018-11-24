'use strict'
const { resolvePath, ...utils } = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const useSourceMap = true

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        path: resolvePath('/dist'),
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[id].[chunkhash].js',
        publicPath: './'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    minChunks: 2,
                    chunks: 'initial'
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    devtool: useSourceMap ? 'source-map' : 'none',
    module: {
        rules: [
            // css
            utils.styleLoader({
                test: /\.(css)$/,
                sourceMap: useSourceMap,
                extract: true
            }),
            // scss
            utils.styleLoader({
                test: /\.(scss)$/,
                loader: 'sass-loader',
                sourceMap: useSourceMap,
                extract: true
            }),
            // sass
            utils.styleLoader({
                test: /\.(sass)$/,
                loader: 'sass-loader',
                sourceMap: useSourceMap,
                indentedSyntax: true,
                extract: true
            }),
        ]
    },
    plugins: [
        // // global variable
        new webpack.DefinePlugin({
            'process.env': 'production'
        }),
        // clean dist
        new CleanWebpackPlugin('dist/*', {
            root: resolvePath('/')
        }),
        // create index.html
        new HtmlWebpackPlugin({
            template: resolvePath('/index.html')
        }),
        // extract css to a single file (chunk name)
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[name].css"
        }),
        // optimize and compress css
        new OptimizeCssAssetsPlugin({
            preset: ['default', { discardComments: { removeAll: true } }]
        })
    ]
})
