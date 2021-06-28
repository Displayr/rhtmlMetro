import _ from 'lodash'
import * as d3 from 'd3'

class Ellipse {
  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'MetroEllipse'
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
    this._clearRootElement()
    let containerEl = d3.select(this.rootElement)
      .attr('data-widget-type', 'rhtmlMetro')

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

    let ellipseInnerWidth = this.width
    let ellipseInnerHeight = this.height

    let boxTextWidth = Math.sqrt(3) / 4 * ellipseInnerWidth * 2
    let boxTextHeight = ellipseInnerHeight / 2
    let topTextMargin = ellipseInnerHeight / 4
    let leftTextMargin = (ellipseInnerWidth - boxTextWidth) / 2

    let ellipse = containerEl.append('div')
      .attr('class', 'metro-ellipse')
      .style('position', 'relative')
      .style('border-radius', '50%')
      .style('box-sizing', 'border-box')
      .style('border', `${border_style.toLowerCase()} ${border_width}px ${border_color}`)
      .style('overflow', 'hidden')
      .style('background', background_color)
      .attr('class', 'MetroEllipseBg')
      .style('width', `${ellipseInnerWidth}px`)
      .style('height', `${ellipseInnerHeight}px`)

    if (text) {
      let textFlexBox = ellipse.append('div')
        // .style('border', 'solid 1px black') // DEBUG only
        .attr('class', 'text-wrapper')
        .style('position', 'absolute')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('justify-content', verticalAlignToJustifyContent(vertical_align))
        .style('top', `${topTextMargin}px`)
        .style('left', `${leftTextMargin}px`)
        .style('width', `${boxTextWidth - border_width * 2}px`)
        .style('height', `${boxTextHeight - border_width * 2}px`)

      let box = textFlexBox.append('div')
        .attr('class', 'text')
        .style('text-align', horizontal_align)
        .style('white-space', (wrap_text) ? 'normal' : 'nowrap')
        .style('overflow', 'hidden')
        .style('font-family', font_family + ', sans-serif')
        .style('font-size', font_size + 'pt')
        .style('color', font_color)
        .style('font-weight', font_bold ? 'bold' : 'normal')
        .style('font-style', font_italic ? 'italic' : 'normal')
        .style('text-decoration', (font_strikethrough) ? 'line-through' : (font_underline) ? 'underline' : '')

      if (as_html) {
        box.html(text)
      } else {
        box.text(text)
      }
    }
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

module.exports = Ellipse

const verticalAlignToJustifyContentMap = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
}
const verticalAlignToJustifyContent = (verticalAlign) =>
  verticalAlignToJustifyContentMap[verticalAlign] || 'center'
