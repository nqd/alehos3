'use strict'

let code = require('./code')

let Alehos = function () {
  this.code = code
  this.handlers = {}
}

/**
 * register a handling function with an event
 * the event should be: discover, onoff, temperature, percentage, healthCheck
 * the object will be wrote to handlers
 *
 * @param {string} name
 * @param {function} fnc
 */
Alehos.prototype.registerHandler = function (eventName, handler) {
  if (typeof handler !== 'function') {
    throw new Error(`Event handler for '${eventName}' was not a function`)
  }

  this.handlers[eventName] = handler
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
      if (header.name === this.code.NAME_TURNON) {
        fn = this.handlers['powerControllerTurnOn']
      }
      if (header.name === this.code.NAME_TURNOFF) {
        fn = this.handlers['powerControllerTurnOff']
      }

      break

    // camera
    case this.code.NAMESPACE_CAMERASTREAMCONTROLLER:
      if (header.name === this.code.NAME_INITIALIZECAMERASTREAM) {
        fn = this.handlers['cameraStreamInitialize']
      }

      break

    // brightness
    case this.code.NAMESPACE_BRIGHTNESSCONTROLLER:
      if (header.name === this.code.NAME_ADJUSTBRIGHTNESS) {
        fn = this.handlers['brightnessControllerAdjust']
      }
      if (header.name === this.code.NAME_SETBRIGHTNESS) {
        fn = this.handlers['brightnessControllerSet']
      }

      break

    // thermostat
    case this.code.NAMESPACE_THERMOSTATCONTROLLER:
      if (header.name === this.code.NAME_ADJUSTTARGETTEMPERATURE) {
        fn = this.handlers['thermostatAdjustTargetTemperature']
      }
      if (header.name === this.code.NAME_SETTARGETTEMPERATURE) {
        fn = this.handlers['thermostatSetTargetTemperature']
      }
      if (header.name === this.code.NAME_SETTHERMOSTATMODE) {
        fn = this.handlers['thermostatSetThermostatMode']
      }

      break

    // authorization
    case this.code.NAMESPACE_AUTHORIZATION:
      if (header.name === this.code.NAME_ACCEPTGRANT) {
        fn = this.handlers['authorization']
      }

      break
  }

  return fn
}

const utils = require('./utils')
/**
 * generate the response
 *
 * @param {object} req {event: {}, context: {}}
 * The request from lambda
 * @param {object} res {err: {}, payload: {}}
 * From user response handler
 * @returns {object}
 */
function _genRes (req, res) {
  let response = {
    event: utils.createResponseEvent(req.event)
  }

  // if err, update the name
  if (res.err) {
    response.event.header.name = 'ErrorResponse'
    // and update payload type
    response.event.payload.type = res.err.code
    // then return
    return response
  }

  // for authorization, we dont need context
  if (req.event.directive.header.namespace === 'Alexa.Authorization' &&
    req.event.directive.header.name === 'AcceptGrant') {
    return response
  }

  // if discovery, payload is in event
  if (response.event.header.namespace === code.NAMESPACE_DISCOVERY) {
    response.event.payload = {
      endpoints: res.payload
    }
    // return
    return response
  }

  // otherwise, payload is in context
  let context = {
    properties: res.payload
  }
  response.context = context
  return response
}

Alehos.prototype.handle = function (event, context, cb) {
  const reqHeader = event && event.directive && event.directive.header
  const req = {
    event: event,
    context: context
  }

  let handFn = this._getHlrFn(reqHeader)

  let handFnCb = (err, payload) => {
    let res = {
      err: err,
      payload: payload
    }
    return cb(null, _genRes(req, res))
  }

  // without supported function
  if (handFn === undefined) {
    let err = new Error()
    err.code = this.code.ERR_INVALID_DIRECTIVE
    return handFnCb(err)
  }
  // else, call the handler function
  handFn(req, handFnCb)
}

module.exports = Alehos
