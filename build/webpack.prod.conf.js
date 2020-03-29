'use strict'
const { resolvePath, ...utils } = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('./config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const StylelintWebpackPlugin = require('stylelint-webpack-plugin')

/**
 * plugins config
 */
const plugins = []
// global variable
plugins.push(new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify('production')
    }
}))
// stylelint
plugins.push(new StylelintWebpackPlugin({
    files: ['**/*.{htm,html,css,scss,sass}'],
    emitErrors: true,
    failOnError: true
}))
// clean dist
plugins.push(new CleanWebpackPlugin())
// multipage (page entrance)
for (const pageName in config.pages) {
    const page = config.pages[pageName]
    plugins.push(
        new HtmlWebpackPlugin({
            filename: page.fileName,
            template: resolvePath(page.template),
            chunks: ['vendors', 'commons', page.chunkName],
            favicon: resolvePath(page.favicon),
            title: page.title,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                chunksSortMode: 'dependency'
            }
        }))
}
// extract css to a single file (chunk name)
plugins.push(new MiniCssExtractPlugin({
    filename: 'css/[id].[contenthash].css',
    chunkFilename: 'css/[id].[contenthash].css'
}))
// optimize and compress css
plugins.push(new OptimizeCssAssetsPlugin({
    preset: ['default', { discardComments: { removeAll: true } }]
}))
// notify on errors
plugins.push(new FriendlyErrorsPlugin({
    onErrors: utils.notifyOnError
}))

/**
 * prod webpack config
 */
const prodConfig = {
    mode: 'production',
    output: {
        path: resolvePath('/dist'),
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[id].[chunkhash].js'
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
    devtool: config.prod.useSourceMap ? 'source-map' : 'none',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolvePath('src')],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    emitError: true,
                    failOnError: true
                }
            },
            // style loaders
            ...utils.styleLoaders({
                sourceMap: config.prod.useSourceMap,
                lastLoader: MiniCssExtractPlugin.loader
            })
        ]
    },
    plugins
}

module.exports = merge(baseWebpackConfig, prodConfig)
