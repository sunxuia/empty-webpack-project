'use strict'
const { resolvePath } = require('./utils')

module.exports = {
    context: resolvePath('/'),
    entry: {
        app: resolvePath('/src/main.js')
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': resolvePath('/src'),
        }
    }
}