'use strict'

/**
 * A unique identifier for a single request or response.
 * This is used for tracking purposes and your skill should log this information,
 * although it should not be used to support business logic.
 * Every message must have this field populated.
 * Any string of alphanumeric characters and dashes less than 128 characters is valid,
 * but a version 4 UUID, which is a UUID generated from random numbers, is recommended.
 *
 * @returns {string} uuid
 */
function createMessageId () {
  const uuidv4 = require('uuid/v4')
  return uuidv4()
}
/**
 *
 *
 * @param {any} req
 */
function createResponseEvent (req) {
  // clone the req
  let event = JSON.parse(JSON.stringify(req.directive))

  if (req.directive.header.namespace === 'Alexa.Discovery' && req.directive.header.name === 'Discover') {
    event.header.namespace = 'Alexa.Discovery'
    event.header.name = 'Discover.Response'
  } else if (req.directive.header.namespace === 'Alexa.Authorization' && req.directive.header.name === 'AcceptGrant') {
    event.header.namespace = req.directive.header.namespace
    event.header.name = 'AcceptGrant.Response'
  } else if (req.directive.header.namespace === 'Alexa.CameraStreamController' && req.directive.header.name === 'InitializeCameraStreams') {
    event.header.namespace = req.directive.header.namespace
    event.header.name = 'Response'
  } else {
    event.header.namespace = 'Alexa'
    event.header.name = 'Response'
  }

  event.header.messageId = createMessageId()

  event.payload = {}

  return event
}

module.exports = {
  createMessageId: createMessageId,
  createResponseEvent: createResponseEvent
}
