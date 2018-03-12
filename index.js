'use strict'

let code = require('./code')
let debug = require('debug')('alehos3')

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
    // Scene
    case this.code.NAMESPACE_SCENECONTROLLER:
      if (header.name === this.code.NAME_ACTIVATE) {
        fn = this.handlers['sceneControllerActivate']
      }
      if (header.name === this.code.NAME_DEACTIVATE) {
        fn = this.handlers['sceneControllerDeactivate']
      }
      break
    // Lock
    case this.code.NAMESPACE_LOCKCONTROLLER:
      if (header.name === this.code.NAME_LOCK) {
        fn = this.handlers['lockControllerLock']
      }
      if (header.name === this.code.NAME_UNLOCK) {
        fn = this.handlers['lockControllerUnlock']
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
 * @param {object} res {err: {}, contextProperties: {}, eventPayload: {}}
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
    response.event.payload = res.err.payload

    response.event.header.namespace = 'Alexa'

    // thermostat controller
    // https://github.com/alexa/alexa-smarthome/blob/master/validation_schemas/alexa_smart_home_message_schema.json#L2098
    if (res.err.payload) {
      if (['THERMOSTAT_IS_OFF',
        'UNSUPPORTED_THERMOSTAT_MODE',
        'DUAL_SETPOINTS_UNSUPPORTED',
        'TRIPLE_SETPOINTS_UNSUPPORTED',
        'UNWILLING_TO_SET_VALUE'
      ].indexOf(res.err.payload.type) >= 0) {
        response.event.header.namespace = 'Alexa.ThermostatController'
      }
    }

    // then return
    return response
  }

  // for authorization, we dont need context
  if (req.event.directive.header.namespace === 'Alexa.Authorization' &&
    req.event.directive.header.name === 'AcceptGrant') {
    return response
  }

  // if discovery, payload is in event
  if (res.contextProperties) {
    response.context = {
      properties: res.contextProperties
    }
  }

  if (res.eventPayload) {
    response.event.payload = res.eventPayload
  }
  return response
}

Alehos.prototype.handle = function (event, context, cb) {
  debug('request %o', event)
  const reqHeader = event && event.directive && event.directive.header
  const req = {
    event: event,
    context: context
  }

  let handFn = this._getHlrFn(reqHeader)

  let handFnCb = (err, contextProperties, eventPayload) => {
    let handRes = {
      err: err,
      contextProperties: contextProperties,
      eventPayload: eventPayload
    }
    let res = _genRes(req, handRes)
    debug('response %o', res)
    return cb(null, res)
  }

  // without supported function
  if (handFn === undefined) {
    let err = new Error()
    err.payload = {
      type: this.code.ERR_INVALID_DIRECTIVE
    }
    return handFnCb(err)
  }
  // else, call the handler function
  handFn(req, handFnCb)
}

module.exports = Alehos
