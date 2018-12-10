beforeEach(() => {
    document.body.innerHTML = '<div id="app" />'
})

it('app dom setted correctly', () => {
    require('@/main')
    expect(document.body).toMatchInlineSnapshot(`
<body>
  <div
    id="app"
  >
    <p
      class="helloWorld"
    >
      Hello World
    </p>
  </div>
</body>
`)
})
