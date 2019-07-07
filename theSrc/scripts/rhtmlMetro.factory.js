import Box from './Box'

module.exports = function (element, width, height) {
  let instance
  return {
    renderValue (incomingConfig) {
      instance = new Box(element)
      instance
        .setConfig(incomingConfig)
        .setWidth(width)
        .setHeight(height)
        .draw()
    },

    resize (newWidth, newHeight) {
      instance
        .setWidth(newWidth)
        .setHeight(newHeight)
        .draw()
    }
  }
}
