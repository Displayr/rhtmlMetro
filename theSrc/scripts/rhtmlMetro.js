/* global HTMLWidgets */
import 'idempotent-babel-polyfill'
import widgetFactory from './rhtmlMetro.factory'

HTMLWidgets.widget({
  name: 'rhtmlMetro',
  type: 'output',
  factory: widgetFactory,
})
