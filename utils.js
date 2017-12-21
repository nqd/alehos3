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
function createMessageId() {
  const uuidv4 = require('uuid/v4')
  return uuidv4()
}
/**
 * 
 * 
 * @param {any} req 
 */
function createResponseEvent(req) {
}

module.exports = {
  createMessageId: createMessageId,
  createResponseEvent: createResponseEvent
}