const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/**
 * resolve path to root
 */
exports.resolvePath = function (dir) {
    return path.join(__dirname, '..', dir)
}

/**
 * generate loader for assets
 */
exports.assetsLoader = function ({ test, outputPath, ...options }) {
    return {
        test,
        loader: 'url-loader',
        options: Object.assign(
            {
                limit: 1000,
                name: '[name].[hash:7].[ext]',
                fallback: 'file-loader'
            },
            options
        )
    }
}

/**
 * generate style loader
 */
exports.styleLoader = function ({ test, loader, extract, ...options }) {
    function generateLoader (loader, loaderOptions) {
        return {
            loader,
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap
            })
        }
    }

    function generateStyleLoaders (cssLoaderOptions) {
        const res = [
            extract ? MiniCssExtractPlugin.loader : generateLoader('style-loader'),
            generateLoader(
                'css-loader',
                Object.assign(
                    {
                        importLoaders: loader ? 2 : 1,
                        limit: 1000
                    },
                    cssLoaderOptions
                )
            )
        ]
        if (loader) {
            res.push(generateLoader(loader, options))
        }
        return res
    }
    return {
        test,
        oneOf: [
            {
                resourceQuery: /module/,
                use: generateStyleLoaders({
                    modules: true,
                    camelCase: 'dashes',
                    localIdentName: '[name]-[local]__[hash:4]'
                })
            },
            {
                use: generateStyleLoaders()
            }
        ]
    }
}
