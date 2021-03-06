module.exports = {
    presets: [
        ['@babel/preset-env', {
            // needed for webpack optimization
            modules: 'commonjs',
            useBuiltIns: 'usage',
            corejs: 2,
            debug: process.env.NODE_ENV === 'development'
        }]
    ],
    plugins: [
        '@babel/transform-runtime'
    ],
    env: {
        test: {
            presets: [
                ['@babel/preset-env', {
                    modules: 'commonjs'
                }]
            ]
        }
    }
}
