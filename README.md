# Alehos, Alexa homeskill built quickly

[![Build Status](https://travis-ci.org/nqd/alehos3.svg?branch=master)](https://travis-ci.org/nqd/alehos3)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

*Note*: this package is under development, you should no rely on this for production.

So that you dont need to write boilerplate code for Alexa Home Skill with Nodejs.

Alehos support routing for the [Smart Home Skill API v3](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference).

## how to use

```{js}
let Alehos = require('alehos3')

let alehos = new Alehos()

alehos.registerHandler('discover', (req, cb) => {
  // get the payload
  // const payload = { ... }
  cb(null, null, payload)
})

alehos.registerHandler('powerControllerTurnOn', (req, cb) => {
  // action ...
  // finally return OK
  cb(null)
})

exports.handler = function(event, context, cb) {
  alehos.handle(event, context, cb)
}
```

## supported functions

- `discover`: discovery
- `powerControllerTurnOn`: turn on
- `powerControllerTurnOff`: turn off
- `authorization`: [Alexa.Authorization Interface](https://developer.amazon.com/docs/device-apis/alexa-authorization.html)

If you don't provide equivalent function, the response will be `INVALID_DIRECTIVE`.

## req

`req` is actually the `event` and `context` object from lambda request. You should looking at event for request message.

## cb(err, contextProperties, eventPayload)

`cb` is the response function.

If you want to return error, generate an new error object, with payload of the intented error.
Example:

```{js}
// if the device is un reachable
let err = new Error()
err.payload = {
  type: alehos.code.ERR_ENDPOINT_UNREACHABLE,
  message: 'device is un reachable'
}
return cb(err)
```

## todos

- [ ] support all functions
- [ ] set/get the event function

## license

MIT
