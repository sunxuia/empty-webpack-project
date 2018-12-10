module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
    },
    extends: ['standard', 'plugin:jest/recommended'],
    plugins: ['babel', 'jest'],
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // indent to 4 space
        'indent': ['warn', 4],
    }
}
