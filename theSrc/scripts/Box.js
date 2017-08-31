/* Box class */

import _ from 'lodash'
import * as d3 from 'd3'

class Box {
  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'Box'
  }

  constructor (el, stateChangedCallback) {
    this.id = `${this.widgetName}-${this.widgetIndex++}`
    this.rootElement = _.has(el, 'length') ? el[0] : el
    this.state = {}
    this.stateChangedCallback = stateChangedCallback
  }

  resize () {

  }

  setUserState (userState = {}) {
    return this
  }

  setConfig (config) {
    this.config = config
    return this
  }

  setWidth (width) {
    this.width = this.config.width ? this.config.width : width
    return this
  }

  setHeight (height) {
    this.height = this.config.height ? this.config.height : height
    return this
  }

  draw () {
    this._clearRootElement()
    let box = d3.select(this.rootElement)
      .append('div')
      .attr('class', 'MetroBox')
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')
      .append('div')
      .style('display', 'table')
      .style('width', '100%')
      .style('height', '100%')
      .style('background-color', this.config.background_color)
      .style('border-style', this.config.border_style)
      .style('border-width', this.config.border_width + 'px')
      .style('border-color', this.config.border_color)
      .style('text-align', this.config.horizontal_align)
      .style('white-space', () => {
        if (this.config.wrap_text) {
          return 'normal'
        } else {
          return 'nowrap'
        }
      })

    if (this.config.text) {
      let box1 = box.append('tspan')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 0)
        .style('display', 'table-cell')
        .style('vertical-align', this.config.vertical_align)
        .style('font-family', this.config.font_family)
        .style('font-size', this.config.font_size + 'px')
        .style('color', this.config.font_color)
        .style('font-weight', this.config.font_bold ? 'bold' : 'normal')
        .style('font-style', this.config.font_italic ? 'italic' : 'normal')
        .style('text-decoration', () => {
          let dec = 'none'
          if (this.config.font_strikethrough) {
            return 'line-through'
          }
            
          if (this.config.font_underline) {
            return 'underline'
          }
        })

      if (this.config.as_html) {
        box1.html(this.config.text)
      } else {
        box1.text(this.config.text)
      }
    }
  }

  _clearRootElement () {
    d3.select(this.rootElement)
      .selectAll('div')
      .remove()
  }
}

module.exports = Box
