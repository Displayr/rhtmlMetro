const Rectangle = require('./Rectangle')

const text = '<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } ' +
  '.embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style>' +
  '<div class="embed-container"><iframe src="https://www.youtube.com/embed/QILiHiTD3uc" frameborder="0" allowfullscreen></iframe></div>'

test('VIS-1010: root element not cleared upon resizing due to entering youtube fullscreen mode', () => {
  const el = document.createElement('div')
  const inner_div = document.createElement('div')
  const inner_svg = document.createElement('svg')
  el.append(inner_div)
  el.append(inner_svg)

  const rect = new Rectangle(el)
  rect.setConfig({ as_html: true, text: text })
  rect.setWidth(window.screen.width)
  rect.setHeight(window.screen.height)
  rect.draw()

  expect(el.children.length).toEqual(2) // existing child elements not cleared upon draw
})
