const rhtmlMetro_factory = require('./rhtmlMetro.factory')

test('VIS-1000: no error if resize called before renderValue', () => {
  const el = document.createElement('div')
  const obj = rhtmlMetro_factory(el)
  obj.resize() // renderValue not called
})
