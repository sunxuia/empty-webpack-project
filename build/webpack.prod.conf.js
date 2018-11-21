'use strict'
const { resolvePath, ...utils } = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')

const useSourceMap = true

module.exports = merge(baseWebpackConfig, {
    output: {
        path: resolvePath('/dist'),
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[id].[chunkhash].js',
        publicPath: '/'
    },
    devtool: useSourceMap ? 'source-map' : 'none',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': 'production'
        })
    ]
})