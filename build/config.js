/**
 * edit this object to custom settings
 */
const config = {
    // public path
    publicPath: '/',
    // variables to inject to process.env.variables
    variables: {},
    // multi-page setting, entry is a must
    pages: {
        app: {
            entry: 'src/main.js'
        }
    },
    // development setting
    dev: {
        devServer: {
            port: process.env.PORT || 8080
        }
    },
    // production setting
    prod: {
        useSourceMap: false
    }
}

/**
 * config auto filling
 */

// setting variables
for (const key of Object.keys(config.variables)) {
    const commandValue = process.env[key]
    if (commandValue !== undefined) {
        config.variables[key] = commandValue
    }
}

// setting pages
for (const pageName in config.pages) {
    const page = config.pages[pageName]
    if (!page.entry) {
        throw new Error(`error in custom.config.js: pages.${pageName}.entry must specific`)
    }
    Object.assign(page, {
        chunkName: pageName,
        template: 'index.html',
        fileName: pageName + '.html',
        favicon: 'logo.png',
        title: ''
    })
}

module.exports = config
