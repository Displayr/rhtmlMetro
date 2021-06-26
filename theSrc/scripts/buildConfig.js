import _ from 'lodash'

const defaultConfig = {
  as_html: false,
  background_color: 'Transparent',
  background_shape: 'Rectangle',
  border_color: 'Transparent',
  border_style: 'Solid',
  border_width: 0,
  font_bold: false,
  font_color: 'black',
  font_family: 'sans-serif',
  font_italic: false,
  font_size: 11,
  font_strikethrough: false,
  font_underline: false,
  text: ' ',
  wrap_text: true,
}

const buildConfig = (userConfig) => _.merge(
  {},
  defaultConfig,
  defaultAlignment(userConfig.background_shape || defaultConfig.background_shape),
  userConfig
)

const defaultAlignment = (shape) => (shape === 'Ellipse')
  ? { horizontal_align: 'center', vertical_align: 'middle' }
  : { horizontal_align: 'left', vertical_align: 'top' }

module.exports = buildConfig
