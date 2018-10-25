'use strict'

let Alehos = require('../index')
let expect = require('chai').expect
let sinon = require('sinon')
let _ = require('underscore')
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
      thermostatSetThermostatMode: function (_req, _cb) { },

      channelControllerChange: function (_req, _cb) { },
      channelControllerSkip: function (_req, _cb) { },

      speakerSetVolume: function (_req, _cb) { },
      speakerAdjustVolume: function (_req, _cb) { },
      speakerSetMute: function (_req, _cb) { },

      stepSpeakerAdjustVolume: function (_req, _cb) { },
      stepSpeakerSetMute: function (_req, _cb) { },

      playBackControllerFastForward: function (_req, _cb) { },
      playBackControllerNext: function (_req, _cb) { },
      playBackControllerPause: function (_req, _cb) { },
      playBackControllerPlay: function (_req, _cb) { },
      playBackControllerPrevious: function (_req, _cb) { },
      playBackControllerRewind: function (_req, _cb) { },
      playBackControllerStartOver: function (_req, _cb) { },
      playBackControllerStop: function (_req, _cb) { },

      inputControllerSelect: function (_req, _cb) { },

      authorization: function (_req, _cb) { }
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
  // ColorController
  it('should call set color controller fnc from related request', () => {
    const event = require('./sample_messages/ColorController/ColorController.SetColor.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.colorControllerSet)
  })

  // ColorTemperatureController
  it('should call colorTemperatureControllerSet() fnc from related request', () => {
    const event = require('./sample_messages/ColorTemperatureController/ColorTemperatureController.SetColorTemperature.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.colorTemperatureControllerSet)
  })

  it('should call colorTemperatureControllerIncrease() fnc from related request', () => {
    const event = require('./sample_messages/ColorTemperatureController/ColorTemperatureController.IncreaseColorTemperature.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.colorTemperatureControllerSet)
  })

  it('should call colorTemperatureControllerDecrease() fnc from related request', () => {
    const event = require('./sample_messages/ColorTemperatureController/ColorTemperatureController.DecreaseColorTemperature.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.colorTemperatureControllerSet)
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

  // Channels
  it('should call change channel fnc from related request', () => {
    const event = require('./sample_messages/ChannelController/ChannelController.ChangeChannel.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.channelControllerChange)
  })
  it('should call skip channels fnc from related request', () => {
    const event = require('./sample_messages/ChannelController/ChannelController.SkipChannels.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.channelControllerSkip)
  })

  // Speaker
  it('should call set volume fnc from speaker adjust volume event', () => {
    const event = require('./sample_messages/Speaker/Speaker.SetVolume.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.speakerSetVolume)
  })
  it('should call adjust volume fnc speaker adjust volume event', () => {
    const event = require('./sample_messages/Speaker/Speaker.AdjustVolume.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.speakerAdjustVolume)
  })
  it('should call set mute fnc from speaker adjust volume event', () => {
    const event = require('./sample_messages/Speaker/Speaker.SetMute.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.speakerSetMute)
  })

  // StepSpeaker
  it('should call adjust volume fnc from step speaker adjust volume event', () => {
    const event = require('./sample_messages/StepSpeaker/StepSpeaker.AdjustVolume.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.stepSpeakerAdjustVolume)
  })
  it('should call set mute fnc from step speaker adjust volume event', () => {
    const event = require('./sample_messages/StepSpeaker/StepSpeaker.SetMute.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.stepSpeakerSetMute)
  })

  // Playback
  it('should call fast foward fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.FastForward.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerFastForward)
  })
  it('should call next fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.Next.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerNext)
  })
  it('should call pause fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.Pause.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerPause)
  })
  it('should call play fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.Play.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerPlay)
  })
  it('should call previous fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.Previous.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerPrevious)
  })
  it('should call rewind fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.Rewind.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerRewind)
  })
  it('should call startOver fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.StartOver.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerStartOver)
  })
  it('should call stop fnc from related request', () => {
    const event = require('./sample_messages/PlaybackController/PlaybackController.Stop.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.playBackControllerStop)
  })

  // Input
  it('should call select input fnc from related request', () => {
    const event = require('./sample_messages/InputController/InputController.SelectInput.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.inputControllerSelect)
  })

  // Scene
  it('should call sceneControllerActivate controller fnc from related request', () => {
    const event = require('./sample_messages/SceneController/SceneController.Activate.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.sceneControllerActivate)
  })
  it('should call sceneControllerDeactivate controller fnc from related request', () => {
    const event = require('./sample_messages/SceneController/SceneController.Deactivate.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.sceneControllerDeactivate)
  })
  // Lock
  it('should call lockControllerLock controller fnc from related request', () => {
    const event = require('./sample_messages/LockController/LockController.Lock.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.lockControllerLock)
  })
  it('should call lockControllerUnlock controller fnc from related request', () => {
    const event = require('./sample_messages/LockController/LockController.Unlock.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.lockControllerUnlock)
  })
  // authorization
  it('should call authorization fnc from related request', () => {
    const event = require('./sample_messages/Authorization/Authorization.AcceptGrant.request.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.authorization)
  })
  // report state
  it('should call reportState fnc from related request', () => {
    const event = require('./sample_messages/StateReport/ReportState.json')
    expect(app._getHlrFn(event.directive.header)).to.eq(app.handlers.reportState)
  })
})

describe('handler', () => {
  beforeEach(() => {
    app = new Alehos()
  })
  it('should return not supported for not register service yet', () => {
    const event = require('./sample_messages/ThermostatController/ThermostatController.SetThermostatMode.request.json')
    const context = {}

    let cbSpy = sinon.spy()
    app.handle(event, context, cbSpy)

    let matched = sinon.match(obj => {
      return obj.event.header.namespace === 'Alexa' &&
        obj.event.header.name === 'ErrorResponse' &&
        obj.event.header.payloadVersion === '3' &&
        obj.event.header.correlationToken === event.directive.header.correlationToken &&
        obj.event.payload.type === 'INVALID_DIRECTIVE'
    })
    sinon.assert.calledWith(cbSpy, null, matched)
  })

  it('should call the equivalent fuc with provided request type', () => {
    // given
    const event = require('./sample_messages/ThermostatController/ThermostatController.SetThermostatMode.request.json')
    const context = {}
    let thermostatSetThermostatMode = sinon.spy()
    app.registerHandler('thermostatSetThermostatMode', thermostatSetThermostatMode)
    // when
    app.handle(event, context, (_err, _payload) => { })
    // then
    sinon.assert.calledWith(
      thermostatSetThermostatMode,
      sinon.match.has('event', event).and(sinon.match.has('context', context))
    )
  })

  it('should return the right payload for discovery', () => {
    // given
    const event = require('./sample_messages/Discovery/Discovery.request.json')
    const context = {}
    const devices = [
      {
        'endpointId': 'endpoint-001',
        'manufacturerName': 'Sample Manufacturer',
        'friendlyName': 'Switch',
        'description': '001 Switch that can only be turned on/off',
        'displayCategories': [
          'SWITCH'
        ],
        'cookie': {
          'detail1': 'For simplicity, this is the only appliance',
          'detail2': 'that has some values in the additionalApplianceDetails'
        },
        'capabilities': [
          {
            'type': 'AlexaInterface',
            'interface': 'Alexa',
            'version': '3'
          },
          {
            'type': 'AlexaInterface',
            'interface': 'Alexa.PowerController',
            'version': '3',
            'properties': {
              'supported': [
                {
                  'name': 'powerState'
                }
              ],
              'proactivelyReported': true,
              'retrievable': true
            }
          },
          {
            'type': 'AlexaInterface',
            'interface': 'Alexa.EndpointHealth',
            'version': '3',
            'properties': {
              'supported': [
                {
                  'name': 'connectivity'
                }
              ],
              'proactivelyReported': true,
              'retrievable': true
            }
          }
        ]
      }]
    let discover = (req, cb) => {
      return cb(null, null, {endpoints: devices})
    }
    app.registerHandler('discover', discover)
    // when
    let resSpy = sinon.spy()
    app.handle(event, context, resSpy)
    // then
    let matched = obj => {
      return _.isEqual(obj.event.payload.endpoints, devices) && !obj.context
    }
    sinon.assert.calledWith(resSpy,
      null,
      sinon.match(matched)
    )
  })
  it('should return the right payload from equivalent fnc', () => {
    // given
    const event = require('./sample_messages/ThermostatController/ThermostatController.SetThermostatMode.request.json')
    const context = {}
    const contextProperty =
      [
        {
          'namespace': 'Alexa.ThermostatController',
          'name': 'targetSetpoint',
          'value': {
            'value': 25,
            'scale': 'CELSIUS'
          },
          'timeOfSample': '2017-09-27T18:30:30.45Z',
          'uncertaintyInMilliseconds': 200
        }
      ]
    let thermostatSetThermostatMode = (req, cb) => {
      return cb(null, contextProperty)
    }
    app.registerHandler('thermostatSetThermostatMode', thermostatSetThermostatMode)
    // when
    let resSpy = sinon.spy()
    app.handle(event, context, resSpy)
    // then
    let matched = obj => {
      return _.isEqual(obj.context.properties, contextProperty)
    }
    sinon.assert.calledWith(resSpy,
      null,
      sinon.match(matched)
    )
  })
  it('should return the right payload from authorization fnc', () => {
    // given
    const event = require('./sample_messages/Authorization/Authorization.AcceptGrant.request.json')
    const context = {}
    let authorization = (req, cb) => {
      return cb(null)
    }
    app.registerHandler('authorization', authorization)
    // when
    let resSpy = sinon.spy()
    app.handle(event, context, resSpy)
    // then
    let matched = obj => {
      return obj.event.header.namespace === 'Alexa.Authorization' &&
        obj.event.header.name === 'AcceptGrant.Response' &&
        obj.event.header.payloadVersion === '3' &&
        obj.context === undefined
    }
    sinon.assert.calledWith(resSpy,
      null,
      sinon.match(matched)
    )
  })
  it('should return the right error message for thermostat TEMPERATURE_VALUE_OUT_OF_RANGE', () => {
    // given
    const event = require('./sample_messages/ThermostatController/ThermostatController.SetTargetTemperature.SingleMode.request.json')
    const context = {}
    const errorPayload = {
      'type': 'TEMPERATURE_VALUE_OUT_OF_RANGE',
      'message': 'The requested temperature of -15 is out of range',
      'validRange': {
        'minimumValue': {
          'value': 15.0,
          'scale': 'CELSIUS'
        },
        'maximumValue': {
          'value': 30.0,
          'scale': 'CELSIUS'
        }
      }
    }
    let thermostatSetTarget = (req, cb) => {
      let err = new Error()
      err.payload = errorPayload
      return cb(err)
    }
    app.registerHandler('thermostatSetTargetTemperature', thermostatSetTarget)
    // when
    let resSpy = sinon.spy()
    app.handle(event, context, resSpy)
    // then
    let matched = obj => {
      return _.isEqual(obj.event.payload, errorPayload) &&
        obj.event.header.namespace === 'Alexa' &&
        obj.event.header.name === 'ErrorResponse'
    }
    sinon.assert.calledWith(resSpy,
      null,
      sinon.match(matched)
    )
  })
  it('should return the right error message for thermostat UNSUPPORTED_THERMOSTAT_MODE', () => {
    // given
    const event = require('./sample_messages/ThermostatController/ThermostatController.SetThermostatMode.request.json')
    const context = {}
    const errorPayload = {
      'type': 'UNSUPPORTED_THERMOSTAT_MODE'
    }
    let thermostatSetMode = (req, cb) => {
      let err = new Error()
      err.payload = errorPayload
      return cb(err)
    }
    app.registerHandler('thermostatSetThermostatMode', thermostatSetMode)
    // when
    let resSpy = sinon.spy()
    app.handle(event, context, resSpy)
    // then
    let matched = obj => {
      return _.isEqual(obj.event.payload, errorPayload) &&
        obj.event.header.namespace === 'Alexa.ThermostatController' &&
        obj.event.header.name === 'ErrorResponse'
    }
    sinon.assert.calledWith(resSpy,
      null,
      sinon.match(matched)
    )
  })
})

describe('createResponseEvent', () => {
  let utils = require('../utils')
  it('should create right namespace for camera stream controller', done => {
    const event = require('./sample_messages/CameraStreamController/CameraStreamController.request.json')
    expect(utils.createResponseEvent(event)).to.has.property('header')
      .that.contain({
        'namespace': 'Alexa.CameraStreamController',
        'name': 'Response',
        'payloadVersion': '3'
      }
    )
    done()
  })
})
