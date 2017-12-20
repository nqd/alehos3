'use strict'

let Alehos = require('../index')
let sinon = require('sinon')
let expect = require('chai').expect

let app

describe('getHlrFn', () => {
  beforeEach(() => {
    app = new Alehos()

    // provide some functions
    app.handlers = {
      discover: function discoverHlr(_req, _cb) { },
      powerControllerTurnOn: function discoverHlr(_req, _cb) { },
      powerControllerTurnOff: function discoverHlr(_req, _cb) { }
    }
  })

  it('should call discovery fnc from discovery event', () => {
    const event = require('./sample_messages/Discovery/Discovery.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.discover)
  })

  it('should call turnon fnc from power control turn on event', () => {
    const event = require('./sample_messages/PowerController/PowerController.TurnOn.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.powerControllerTurnOn)
  })

  it('should call turnoff fnc from power control turn off event', () => {
    const event = require('./sample_messages/PowerController/PowerController.TurnOff.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.powerControllerTurnOff)
  })
})