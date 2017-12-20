'use strict'

let Alehos = require('../index')
let sinon = require('sinon')

let app

describe('getHlrFn', () => {
  beforeEach(() => {
    app = new Alehos()

    // provide some functions
    app.handlers = {
      discover: function discoverHlr(_req, _cb) { }
    }
  })

  it('should call discovery fnc from discovery event', () => {
    const event = require('./sample_messages/Discovery/Discovery.request.json')
    expect(app._getHlrFn(event.header.name)).to.eq(app.handlers.discover)
  })
})