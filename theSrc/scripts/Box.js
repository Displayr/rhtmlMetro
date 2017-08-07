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
    console.log(this.config)
  }

  draw () {
    d3.select(this.rootElement)
      .append("svg")
      .attr("class", "rootsvg")
      .attr("width", this.config.width)
      .attr("height", this.config.height)
  }

  _clearRootElement () {

  }

}

module.exports = Box