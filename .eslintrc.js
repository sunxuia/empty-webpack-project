module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
    },
    extends: ['standard'],
    plugins: ['babel'],
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}
