'use strict'

let code = require('./code')

let Alehos = function () {
    this.code = code
    this.handlers = {}
}

/**
 * Given header of the request, provide handling function
 *
 * @param {string} header
 * @returns {function}
 */
Alehos.prototype._getHlrFn = function (header) {
    let fn
    switch (header.namespace) {
        // discovery
        case this.code.NAMESPACE_DISCOVERY:
            fn = this.handlers['discover']
            break

        // power control
        case this.code.NAMESPACE_POWERCONTROL:
            if (header.name === this.code.NAME_TURNON)
                fn = this.handlers['powerControllerTurnOn']
            else if (header.name === this.code.NAME_TURNOFF)
                fn = this.handlers['powerControllerTurnOff']

            break

        case this.code.NAMESPACE_CAMERA_STREAMCONTROLLER:
            if (header.name === this.code.NAME_INITIALIZECAMERASTREAM)
                fn = this.handlers['cameraStreamInitialize']

            break
    }

    return fn
}

module.exports = Alehos