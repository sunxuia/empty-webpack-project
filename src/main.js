import sass from '@/sass.sass?module'

var app = document.getElementById('app')
app.innerHTML = `<p class="${sass.helloWorld}">Hello World</p>`
