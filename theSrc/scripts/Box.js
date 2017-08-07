/* Box class */

import _ from 'lodash'
import * as d3 from 'd3'

class Box {

  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'Box'
  }

  constructor (el, width, height, stateChangedCallback) {
    this.id = `${this.widgetName}-${this.widgetIndex++}`
    this.rootElement = _.has(el, 'length') ? el[0] : el
    this.initialWidth = width
    this.initialHeight = height
    this.state = {}
    this.stateChangedCallback = stateChangedCallback
  }

  resize (width, height) {

  }


  setUserState (userState = {}) {

  }

  setConfig (config) {
    this.config = config
  }

  draw () {
    let box = d3.select(this.rootElement)
      .append("div")
      .attr("class", "box_el")
      .style("width", this.config.width + "px")
      .style("height", this.config.height + "px")
      .style("border-style", this.config.border_style)
      .style("border-width", this.config.border_width + "px")
      .style("border-color", this.config.border_color + "px")

    if (this.config.text) {
      box.append("text")
        .text(this.config.text)
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", 0)
        .style("font-family", this.config.font_family)
        .style("font-size", this.config.font_size + "px")
        .style("text-decoration", () => {
          let dec = "none"
          if (this.config.font_strikethrough) 
            return "line-through"
          if (this.config.font_underline)
            return "underline"
        })
    }
  }

  _clearRootElement () {

  }

}

module.exports = Box