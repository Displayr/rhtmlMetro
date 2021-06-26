const cliArgs = require('yargs').argv
const _ = require('lodash')

const config = {
  widgetEntryPoint: 'theSrc/scripts/rhtmlMetro.js',
  widgetFactory: 'theSrc/scripts/rhtmlMetro.factory.js',
  widgetName: 'rhtmlMetro',
  internalWebSettings: {
    includeDimensionsOnWidgetDiv: true,
    default_border: false,
    isReadySelector: '[data-widget-type="rhtmlMetro"]',
    css: [],
    singleWidgetSnapshotSelector: '#widget-container',
  },
  snapshotTesting: {
    puppeteer: {
      // headless: false, // if set to false, show the browser while testing
      // slowMo: 500, // delay each step in the browser interaction by X milliseconds
    },
    snapshotDelay: 500,
    consoleLogHandler: () => {},
  },
}

const commandLineOverides = _.omit(cliArgs, ['_', '$0'])
const mergedConfig = _.merge(config, commandLineOverides)

module.exports = mergedConfig
