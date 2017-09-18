/* UpDown class */

import _ from 'lodash'
import * as d3 from 'd3'

class UpDown {
  static initClass () {
    this.widgetIndex = 0
    this.widgetName = 'UpDown'
  }

  constructor (el, width, height, stateChangedCallback) {
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
    let updown = d3.select(this.rootElement)
      .append('div')
      .append('svg')
      .attr('class', 'MetroUpdown')
      .attr('width', this.width + 'px')
      .attr('height', this.height + 'px')

    let arrow = updown.append('g')
      .attr('class', 'arrow')

    let number = updown.append('g')
      .attr('class', 'number')

    let unit;
    if (this.config.topunit || this.config.bottomunit) {
      unit = updown.append('g')
        .attr('class', 'unit')
    }




  }

  _clearRootElement () {
    d3.select(this.rootElement)
      .selectAll('div')
      .remove()
  }
}

module.exports = UpDown
