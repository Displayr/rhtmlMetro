const Rectangle = require('./Rectangle')

const youtube = '<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } ' +
  '.embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style>' +
  '<div class="embed-container"><iframe src="https://www.youtube.com/embed/QILiHiTD3uc" frameborder="0" allowfullscreen></iframe></div>'

const video_tag = '<video width="480px" height="360px" controls>' +
  '<source src="https://wario.blob.core.windows.net/videos/profiling1.mp4?sp=r&st=2020-08-19T03:00:36Z&se=2050-08-19T11:00:36Z&spr=https&sv=2019-12-12&sr=b&sig=MGIsz3yPx2djI40awmA%2FS4ha0RZMFf2cQbUZqqkgkus%3D" >' +
  '</video>'

test('VIS-1010 and RS-12497: root element not cleared upon resizing due to entering fullscreen mode', () => {
  [youtube, video_tag].forEach((t, i) => {
    const el = document.createElement('div')
    const inner_div = document.createElement('div')
    inner_div.setAttribute('id', 'inner_div' + i)
    el.append(inner_div)

    const rect = new Rectangle(el)
    rect.setConfig({ as_html: true, text: t })
    rect.setWidth(window.screen.width)
    rect.setHeight(window.screen.height)
    rect.draw()

    // inner_div not cleared upon draw
    expect(el.children.length).toEqual(1)
    expect(el.children[0].getAttribute('id')).toEqual('inner_div' + i)
  })
})
