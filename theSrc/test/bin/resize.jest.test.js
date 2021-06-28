const puppeteer = require('puppeteer')
const { snapshotTesting: { renderExamplePageTestHelper } } = require('rhtmlBuildUtils')
const loadWidget = require('../lib/loadWidget.helper')

const {
  configureImageSnapshotMatcher,
  puppeteerSettings,
  testSnapshots,
  jestTimeout,
} = renderExamplePageTestHelper

jest.setTimeout(jestTimeout)
configureImageSnapshotMatcher({ collectionIdentifier: 'resize' })

describe('resize', () => {
  let browser

  beforeEach(async () => {
    browser = await puppeteer.launch(puppeteerSettings)
  })

  afterEach(async () => {
    await browser.close()
  })

  test('basic resize rectangle', async function () {
    const { page } = await loadWidget({
      browser,
      configName: 'data.test.minimal_rectangle',
      width: 500,
      height: 500,
    })

    await testSnapshots({ page, testName: '1A_basic_initial_rectangle' })

    const sizesToSnapshot = [
      { width: 600, height: 600 },
      { width: 600, height: 300 },
      { width: 300, height: 600 },
      { width: 500, height: 500 },
    ]

    for (const size of sizesToSnapshot) {
      const { width, height } = size
      await page.evaluate((width, height) => {
        window.resizeHook(width, height)
      }, width, height)

      await page.waitFor(1000)

      await testSnapshots({ page, testName: `1B_basic_after_resize_rectangle_${width}x${height}` })
    }
    await page.close()
  })

  test('basic resize ellipse', async function () {
    const { page } = await loadWidget({
      browser,
      configName: 'data.test.minimal_ellipse',
      width: 500,
      height: 500,
    })

    await testSnapshots({ page, testName: '1A_basic_initial_ellipse' })

    const sizesToSnapshot = [
      { width: 600, height: 600 },
      { width: 600, height: 300 },
      { width: 300, height: 600 },
      { width: 500, height: 500 },
    ]

    for (const size of sizesToSnapshot) {
      const { width, height } = size
      await page.evaluate((width, height) => {
        window.resizeHook(width, height)
      }, width, height)

      await page.waitFor(1000)

      await testSnapshots({ page, testName: `1B_basic_after_resize_ellipse_${width}x${height}` })
    }
    await page.close()
  })
})
