/* global HTMLWidgets */

import _ from 'lodash'
import Box from './Box'
import UpDown from './UpDown'
import DisplayError from './DisplayError'

HTMLWidgets.widget({
  name: 'rhtmlMetro',
  type: 'output',

  factory (element, width, height, stateChangedCallback) {

    //const instance = new Box(element, width, height, stateChangedCallback)
    let instance;
    return {
      renderValue (incomingConfig, userState) {

        switch (incomingConfig.class) {
          case 'box':
            instance = new Box(element, stateChangedCallback)
            break;
          case 'updown':
            instance = new UpDown(element, stateChangedCallback)
            break;
          case 'donut':
            break;
        }

        instance.setConfig(incomingConfig)
        .setWidth(width)
        .setHeight(height)
        .setUserState(userState)
        .draw()
        // let config = null
        // try {
        //   if (_.isString(incomingConfig)) {
        //     config = JSON.parse(incomingConfig)
        //   } else {
        //     config = incomingConfig
        //   }
        // } catch (err) {
        //   const readableError = new Error(`Template error : Cannot parse 'settingsJsonString': ${err}`)
        //   console.error(readableError)
        //   const errorHandler = new DisplayError(element, readableError)
        //   errorHandler.draw()
        //   throw new Error(err)
        // }

        // // @TODO for now ignore the width height that come through from config and use the ones passed to constructor
        // // @TODO need to change this to match rhtmlPictograph
        // delete config.width
        // delete config.height

        // try {
        //   instance.setConfig(config)
        //   instance.setUserState(userState)
        //   return instance.draw()
        // } catch (err) {
        //   console.error(err.stack)
        //   const errorHandler = new DisplayError(element, err)
        //   errorHandler.draw()
        //   throw new Error(err)
        // }
      },

      resize (newWidth, newHeight) {
        instance.setWidth(newWidth).setHeight(newHeight).draw()
      }
    }
  }
})
