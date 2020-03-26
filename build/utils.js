const path = require('path')
const notifier = require('node-notifier')

/**
 * resolve path to root
 */
exports.resolvePath = function (dir) {
    return path.join(__dirname, '..', dir)
}

/**
 * generate loader for assets
 */
exports.assetsLoader = function ({
    test,
    outputPath,
    ...options
}) {
    return {
        test,
        loader: 'url-loader',
        options: Object.assign({
            limit: 1000,
            name: '[name].[hash:7].[ext]',
            fallback: 'file-loader'
        }, options)
    }
}

/**
 * generate style loaders
 */
exports.styleLoaders = function ({ sourceMap, lastLoader }) {
    function generateLoaders (isModule, loader, options = {}) {
        const loaders = []
        if (lastLoader) {
            loaders.push(lastLoader)
        }
        loaders.push({
            loader: 'css-loader',
            options: {
                importLoaders: loader ? 2 : 1,
                localsConvention: 'dashes',
                modules: isModule ? {
                    mode: 'local',
                    localIdentName: '[name]-[local]__[hash:4]'
                } : false,
                sourceMap
            }
        })
        loaders.push({
            loader: 'postcss-loader',
            options: {
                sourceMap
            }
        })
        if (loader) {
            loaders.push({
                loader: loader,
                options
            })
        }
        return loaders
    }

    function generateStyleLoader (test, loader, options) {
        return {
            test,
            oneOf: [
                {
                    resourceQuery: /module/,
                    use: generateLoaders(true, loader, options)
                },
                {
                    use: generateLoaders(false, loader, options)
                }
            ]
        }
    }

    return [
        generateStyleLoader(/\.css$/, null, { sourceMap }),
        generateStyleLoader(/\.scss$/, 'sass-loader'),
        generateStyleLoader(/\.sass$/, 'sass-loader', { sassOptions: { indentedSyntax: true } }),
        generateStyleLoader(/\.less$/, 'less-loader', { sourceMap }),
        generateStyleLoader(/\.stylus$/, 'stylus-loader', { sourceMap }),
        generateStyleLoader(/\.styl$/, 'stylus-loader', { sourceMap })
    ]
}

/**
 * show a message on desktop when error
 */
exports.notifyOnError = function (severity, errors) {
    if (severity === 'error') {
        const error = errors[0]
        const filename = error.file
        notifier.notify({
            title: 'webpack build error',
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: exports.resolvePath('logo.png')
        })
    }
}
