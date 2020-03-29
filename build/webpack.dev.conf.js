'use strict'
const { resolvePath, ...utils } = require('./utils')
const config = require('./config')
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const StylelintWebpackPlugin = require('stylelint-webpack-plugin')

/**
 * webpack-dev-server config
 */
const devServer = Object.assign({
    publicPath: config.publicPath,
    host: 'localhost',
    clientLogLevel: 'warning',
    hot: true
}, config.dev.devServer)
// multipage
if (!devServer.historyApiFallback) {
    devServer.historyApiFallback = {}
    const pageNames = Object.keys(config.pages)
    if (pageNames.length === 1) {
        const indexPath = config.publicPath + config.pages[pageNames[0]].fileName
        devServer.index = indexPath
        devServer.historyApiFallback.index = indexPath
    } else {
        const rewrites = []
        for (const pageName of pageNames) {
            const page = config.pages[pageName]
            const from = pageName.replace(/([*.+$^[\](){}\\/])/g, '\\$1')
            rewrites.push({
                from: new RegExp(`\\/${from}(?:[\\/?#]|$)`),
                to: config.publicPath + page.fileName
            })
        }
        devServer.historyApiFallback.rewrites = rewrites
    }
}

/**
 * pluings config
 */
const plugins = []
// global variable
plugins.push(new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify('development')
    }
}))
// stylelint
plugins.push(new StylelintWebpackPlugin({
    files: ['**/*.{htm,html,css,scss,sass}'],
    emitErrors: false,
    failOnError: false
}))
// multipage (page entrance)
for (const pageName in config.pages) {
    const page = config.pages[pageName]
    plugins.push(new HtmlWebpackPlugin({
        filename: page.fileName,
        template: resolvePath(page.template),
        chunks: ['vendors', 'commons', page.chunkName],
        favicon: resolvePath(page.favicon),
        title: page.title
    }))
}
// hot replacement for webpack-dev-server
plugins.push(new webpack.HotModuleReplacementPlugin())

/**
 * dev webpack config
 */
const devConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer,
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
                    fix: true,
                    emitWarning: true,
                    failOnError: false
                }
            },
            // style loaders
            ...utils.styleLoaders({
                sourceMap: true,
                lastLoader: {
                    loader: 'style-loader'
                }
            })
        ]
    },
    plugins
})

module.exports = new Promise((resolve, reject) => {
    // setting port dynamically
    portfinder.getPort({
        port: devConfig.devServer.port
    }, (err, port) => {
        if (err) {
            reject(err)
        } else {
            process.env.PORT = port
            devConfig.devServer.port = port
            devConfig.plugins.push(
                // notify on errors
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${devConfig.devServer.host}:${devConfig.devServer.port}`
                        ]
                    },
                    onErrors: utils.notifyOnError
                }))
            resolve(devConfig)
        }
    })
})
