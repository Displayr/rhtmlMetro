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
    let containerEl = d3.select(this.rootElement)
      .append('div')
      .attr('class', 'MetroContainer')

    let containerBG
    if (this.config.background_shape == 'Ellipse') {
      containerBG = containerEl
      .append('svg')
      .attr('class', 'MetroBoxBg')
      .attr('width', this.width + 'px')
      .attr('height', this.height + 'px')
    }
    
    let containerMain = containerEl
      .append('div')
      .attr('class', 'MetroBox')
      .style('position', 'Absolute')
      .style('top', 0)
      .style('width', this.width + 'px')
      .style('height', this.height + 'px')

    let box = containerMain.append('div')
      .attr('class', 'MetroBoxInner')
      .style('display', 'table')
      .style('width', this.config.border_width == 0 ? this.width + 'px' : (this.width-this.config.border_width*2) + 'px')
      .style('height', this.config.border_width == 0 ? this.height + 'px' : (this.height-this.config.border_width*2) + 'px')
      .style('text-align', this.config.horizontal_align)
      .style('white-space', () => {
        if (this.config.wrap_text) {
          return 'normal'
        } else {
          return 'nowrap'
        }
      })

    if (this.config.background_shape == 'Rectangle') {
      box.style('background-color', this.config.background_color)
      .style('border-style', this.config.border_style)
      .style('border-width', this.config.border_width + 'px')
      .style('border-color', this.config.border_color)

    } else if (this.config.background_shape == 'Ellipse'){
      containerBG.append('ellipse')
        .attr('class', 'BoxEllipse')
        .attr('cx',this.width/2 + 'px')
        .attr('cy',this.height/2 + 'px')
        .attr('rx',this.config.border_width == 0 ? this.width/2 + 'px' : (this.width-this.config.border_width*2)/2 + 'px')
        .attr('ry',this.config.border_width == 0 ? this.height/2 + 'px' : (this.height-this.config.border_width*2)/2 + 'px')
        .style('stroke', this.config.border_color)
        .style('stroke-width', this.config.border_width + 'px')
        .style('stroke-dasharray', ()=>{
          if (this.config.border_style == 'Solid') {
            return undefined
          } else if (this.config.border_style == 'Dashed') {
            return '7,7'
          } else {
            console.log('Error: Elliptic background only support Solid or Dashed borders')
            return undefined
          }
        })
        .style('fill', this.config.background_color)

    } else {
      console.log('Incorrect background color input')
    }


    if (this.config.text) {
      let box1 = box.append('tspan')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 0)
        .style('display', 'table-cell')
        .style('vertical-align', this.config.vertical_align)
        .style('font-family', this.config.font_family + ', sans-serif')
        .style('font-size', this.config.font_size + 'pt')
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
