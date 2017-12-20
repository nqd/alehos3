'use strict'

let Alehos = require('../index')
let expect = require('chai').expect

let app

describe('getHlrFn', () => {
  beforeEach(() => {
    app = new Alehos()

    // provide some functions
    app.handlers = {
      discover: function (_req, _cb) { },

      powerControllerTurnOn: function (_req, _cb) { },
      powerControllerTurnOff: function (_req, _cb) { },

      cameraStreamInitialize: function (_req, _cb) { },

      brightnessControllerAdjust: function (_req, _cb) { },
      brightnessControllerSet: function (_req, _cb) { },

      thermostatAdjustTargetTemperature: function (_req, _cb) { },
      thermostatSetTargetTemperature: function (_req, _cb) { },
      thermostatSetThermostatMode: function (_req, _cb) { }
    }
  })

  it('should call discovery fnc from discovery event', () => {
    const event = require('./sample_messages/Discovery/Discovery.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.discover)
  })

  // power controller
  it('should call turnon fnc from power control turn on event', () => {
    const event = require('./sample_messages/PowerController/PowerController.TurnOn.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.powerControllerTurnOn)
  })

  it('should call turnoff fnc from power control turn off event', () => {
    const event = require('./sample_messages/PowerController/PowerController.TurnOff.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.powerControllerTurnOff)
  })

  // camera
  it('should call camera stream controller fnc from get camera stream event', () => {
    const event = require('./sample_messages/CameraStreamController/CameraStreamController.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.cameraStreamInitialize)
  })

  // brightness
  it('should call adjust brightness controller fnc from related request', () => {
    const event = require('./sample_messages/BrightnessController/BrightnessController.AdjustBrightness.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.brightnessControllerAdjust)
  })
  it('should call set brightness controller fnc from related request', () => {
    const event = require('./sample_messages/BrightnessController/BrightnessController.SetBrightness.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.brightnessControllerSet)
  })

  // thermostat
  it('should call adjust temperature fnc from related request', () => {
    const event = require('./sample_messages/ThermostatController/ThermostatController.AdjustTargetTemperature.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.thermostatAdjustTargetTemperature)
  })
  it('should call set target temperature fnc from related request', () => {
    const event = require('./sample_messages/ThermostatController/ThermostatController.SetTargetTemperature.SingleMode.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.thermostatSetTargetTemperature)
  })
  it('should call set thermostat mode fnc from related request', () => {
    const event = require('./sample_messages/ThermostatController/ThermostatController.SetThermostatMode.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.thermostatSetThermostatMode)
  })
})

describe('registerHandler', () => {
  beforeEach(() => {
    app = new Alehos()
  })
  it('should refuse to register handler with non function', done => {
    expect(() => {
      app.registerHandler('key', 'not a function')
    }).to.throw(Error)
    done()
  })
  it('should register a function to its handlers list', done => {
    let hdlr = function () {}
    app.registerHandler('key', hdlr)
    expect(app.handlers['key']).to.deep.eq(hdlr)
    done()
  })
})
