# empty-webpack-project

An empty webpack 4 project with development and production settings.

## build/config.js

Use a convenient build/config.js file to set settings and vriables in webpack's configuration files, current configurations :

```javascript
const config = {
    // public path
    publicPath: '/',
    // variables to inject to process.env.variables
    variables: {},
    // multi-page setting, should at least set one page
    pages: {
        // <keyName> ("app") is used to set default value and devServer's path prefix
        app: {
            // entry, must
            entry: 'src/main.js',
            // webpack's entry key, default is <keyName>
            chunkName: 'app',
            // html template path, default is index.html
            template: 'index.html',
            // generated html file name, default is app.html
            fileName: 'app.html',
            // generated html's favicon, default is logo.png
            favicon: 'logo.png',
            // generated html's title, default is ''
            title: ''
        }
    },
    // development setting
    dev: {
        // devServer's setting
        devServer: {
            port: process.env.PORT || 8080
        }
    },
    // production setting
    prod: {
        useSourceMap: false
    }
}
```
