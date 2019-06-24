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
        },
        options
        )
    }
}

/**
 * generate style loaders
 */
exports.styleLoaders = function ({
    sourceMap = true,
    lastLoader = 'style-loader'
}) {
    if (typeof (lastLoader) === 'string') {
        lastLoader = generateLoader(lastLoader)
    }

    function generateLoader (loader, loaderOptions) {
        return {
            loader,
            options: Object.assign({}, loaderOptions, {
                sourceMap
            })
        }
    }

    function generateLoaders (isModule, loader, options) {
        const loaders = []
        if (lastLoader) {
            loaders.push(lastLoader)
        }
        loaders.push(generateLoader('css-loader', {
            importLoaders: loader ? 2 : 1,
            localsConvention: 'dashes',
            modules: isModule ? {
                mode: 'local',
                localIdentName: '[name]-[local]__[hash:4]'
            } : false
        }))
        loaders.push(generateLoader('postcss-loader'))
        if (loader) {
            loaders.push(generateLoader(loader, options))
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
        generateStyleLoader(/\.css$/),
        generateStyleLoader(/\.scss$/, 'sass-loader'),
        generateStyleLoader(/\.sass$/, 'sass-loader', { indentedSyntax: true }),
        generateStyleLoader(/\.less$/, 'less-loader'),
        generateStyleLoader(/\.stylus$/, 'stylus-loader'),
        generateStyleLoader(/\.styl$/, 'stylus-loader')
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
