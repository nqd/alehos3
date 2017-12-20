'use strict'

let code = require('./code')

let Alehos = function () {
    this.code = code
    this.handlers = {}
}

/**
 * Given type of the request, provide handling function
 *
 * @param {string} type
 * @returns {function}
 */
Alehos.prototype._getHlrFn = function (type) {
    let fn
    switch (type) {
        case this.code.NAMESPACE_DISCOVERY:
            fn = this.handlers['discover']
            break
    }

    return fn
}

module.exports = Alehos