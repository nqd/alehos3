'use strict'

let expect = require('chai').expect
let utils = require('../utils')

describe('responseEvent', () => {
  it('should generate response event for power controller', done => {
    const req = require('./sample_messages/PowerController/PowerController.TurnOn.request.json')
    const resEvent = utils.createResponseEvent(req)

    expect(resEvent.header).to.contains({
      namespace: 'Alexa',
      name: 'Response',
      payloadVersion: '3',
      correlationToken: req.directive.header.correlationToken
    })

    done()
  })
})