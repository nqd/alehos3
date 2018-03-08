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
    expect(resEvent.header).to.has.property('messageId')

    expect(resEvent.endpoint).to.eql(req.directive.endpoint)
    expect(resEvent.payload).to.eql({})

    done()
  })

  it('should generate response event for discovery', done => {
    const req = require('./sample_messages/Discovery/Discovery.request.json')
    const resEvent = utils.createResponseEvent(req)

    expect(resEvent.header).to.contains({
      namespace: 'Alexa.Discovery',
      name: 'Discover.Response',
      payloadVersion: '3'
    })
    expect(resEvent.header).to.has.property('messageId')

    done()
  })
  it('should generate response event for scene control activate', done => {
    const req = require('./sample_messages/SceneController/SceneController.Activate.request.json')
    const resEvent = utils.createResponseEvent(req)

    expect(resEvent.header).to.contains({
      namespace: 'Alexa.SceneController',
      name: 'ActivationStarted',
      payloadVersion: '3'
    })
    expect(resEvent.header).to.has.property('messageId')

    done()
  })
  it('should generate response event for scene control deactivate', done => {
    const req = require('./sample_messages/SceneController/SceneController.Deactivate.request.json')
    const resEvent = utils.createResponseEvent(req)

    expect(resEvent.header).to.contains({
      namespace: 'Alexa.SceneController',
      name: 'DeactivationStarted',
      payloadVersion: '3'
    })
    expect(resEvent.header).to.has.property('messageId')

    done()
  })
})
