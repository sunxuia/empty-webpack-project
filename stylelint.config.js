module.exports = {
    extends: [
        'stylelint-config-recommended',
        'stylelint-config-recommended-scss'
    ],
    plugins: [
        'stylelint-scss'
    ],
    rules: {
        'indentation': [4, {
            baseIndentLevel: 0
        }],
        'selector-pseudo-class-no-unknown': [true, {
            ignorePseudoClasses: ['global', 'local']
        }]
    }
}
