module.exports = {
    presets: [
        ['@babel/preset-env', {
            // needed for webpack optimization
            modules: 'commonjs',
            useBuiltIns: 'usage',
            debug: process.env.NODE_ENV === 'development'
        }]
    ],
    plugins: [
        '@babel/transform-runtime'
    ]
}
