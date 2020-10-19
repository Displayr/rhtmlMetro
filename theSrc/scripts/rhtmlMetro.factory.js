import _ from 'lodash'
import Ellipse from './Ellipse'
import Rectangle from './Rectangle'
import buildConfig from './buildConfig'

module.exports = function (element) {
  let instance
  return {
    renderValue (incomingConfig) {
      const config = _.merge(buildConfig(incomingConfig), containerDimensions(element))
      const { width, height } = containerDimensions(element)
      console.log('renderValue. Observed container size:', JSON.stringify({ width, height }))
      instance = (config.background_shape === 'Ellipse')
        ? new Ellipse(element)
        : new Rectangle(element)

      instance
        .setConfig(config)
        .setWidth(width)
        .setHeight(height)
        .draw()
    },

    resize () {
      const { width, height } = containerDimensions(element)
      console.log('resize. Observed container size:', JSON.stringify({ width, height }))
      instance
        .setWidth(width)
        .setHeight(height)
        .draw()
    }
  }
}

const containerDimensions = (element) => {
  const rootElement = _.has(element, 'length') ? element[0] : element
  try {
    return { width: rootElement.offsetWidth, height: rootElement.offsetHeight }
  } catch (err) {
    err.message = `fail in containerDimensions: ${err.message}`
    throw err
  }
}
