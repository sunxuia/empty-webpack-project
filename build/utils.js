const path = require('path')

/**
 * resolve path to root
 */
exports.resolvePath = function (dir) {
    return path.join(__dirname, '..', dir)
}