'use strict'
const { resolvePath, ...utils } = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')

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
        // runtimeChunk: true,
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
            'process.env.NODE_ENV': 'production'
        }),
        // clean dist
        new CleanWebpackPlugin(['dist/css/', 'dist/js/'], {
            root: resolvePath('/')
        }),
        // create index.html
        new HtmlWebpackPlugin({
            template: resolvePath('/index.html'),
            favicon: resolvePath('logo.png'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                chunksSortMode: 'dependency'
            }
        }),
        // extract css to a single file (chunk name)
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[name].css"
        }),
        // optimize and compress css
        new OptimizeCssAssetsPlugin({
            preset: ['default', { discardComments: { removeAll: true } }]
        }),
        // notify on errors
        new FriendlyErrorsPlugin({
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
        })
    ]
})
