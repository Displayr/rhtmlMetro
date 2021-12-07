const _ = require('lodash')
const d3 = require('d3')

class Rectangle {
  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'MetroRectangle'
  }

  constructor (el) {
    this.id = `${this.widgetName}-${this.widgetIndex++}`
    this.rootElement = _.has(el, 'length') ? el[0] : el
  }

  setConfig (config) {
    this.config = config
    return this
  }

  setWidth (width) {
    this.width = width
    return this
  }

  setHeight (height) {
    this.height = height
    return this
  }

  draw () {
    const {
      as_html,
      border_color,
      border_style,
      border_width,
      background_color,
      font_bold,
      font_color,
      font_family,
      font_italic,
      font_size,
      font_strikethrough,
      font_underline,
      horizontal_align,
      text,
      vertical_align,
      wrap_text,
    } = this.config

    // VIS-1021: allow embedded youtube videos to go to fullscreen
    if (as_html && typeof text === 'string' && text.match('allowfullscreen') && this.width === window.screen.width && this.height === window.screen.height) {
      return
    }

    this._clearRootElement()
    let containerEl = d3.select(this.rootElement)
      .attr('htmlwidget-status', 'loading')

    let containerMain = containerEl
      .append('div')
      .attr('class', 'MetroRectangle')
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')

    let box = containerMain.append('div')
      .attr('class', 'MetroRectangleInner')
      .style('display', 'table')
      .style('width', border_width === 0 ? this.width + 'px' : (this.width - border_width * 2) + 'px')
      .style('height', border_width === 0 ? this.height + 'px' : (this.height - border_width * 2) + 'px')
      .style('text-align', horizontal_align)
      .style('white-space', () => {
        if (wrap_text) {
          return 'normal'
        } else {
          return 'nowrap'
        }
      })

    box.style('background-color', background_color)
      .style('border-style', border_style)
      .style('border-width', border_width + 'px')
      .style('border-color', border_color)

    if (text) {
      let box1 = box.append('tspan')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 0)
        .style('display', 'table-cell')
        .style('vertical-align', vertical_align)
        .style('font-family', font_family + ', sans-serif')
        .style('font-size', font_size + 'pt')
        .style('color', font_color)
        .style('font-weight', font_bold ? 'bold' : 'normal')
        .style('font-style', font_italic ? 'italic' : 'normal')
        .style('text-decoration', () => {
          if (font_strikethrough) {
            return 'line-through'
          }

          if (font_underline) {
            return 'underline'
          }
        })

      if (as_html) {
        box1.html(text)
      } else {
        box1.text(text)
      }
    }

    containerEl.attr('htmlwidget-status', 'ready')
  }

  _clearRootElement () {
    d3.select(this.rootElement)
      .selectAll('div')
      .remove()

    d3.select(this.rootElement)
      .selectAll('svg')
      .remove()
  }
}

module.exports = Rectangle
