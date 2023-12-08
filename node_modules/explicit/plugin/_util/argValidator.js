'use strict'

const Joi = require('@hapi/joi')

module.exports = function createArgValidator (method) {
  var firstCall = true
  const $argsLength = method.$args.length
  const $argNames = []
  const helperObject = {}
  let testSchema = {}

  function initCall () {
    firstCall = false

    method.$args.forEach(function ($arg, no) {
      $arg = Joi.compile($arg)
      const name = $arg.describe().meta || no
      testSchema[name] = $arg
      $argNames.push(name)
    })

    testSchema = Joi.object().keys(testSchema).unknown()
  }

  function applyObject (scope, object, args) {
    if (firstCall) {
      initCall()
    }

    if (!args) {
      args = []
    }

    let res = Joi.validate(object, testSchema)

    if (res.error) {
      throw res.error
    }

    res = res.value

    for (let i = 0; i < $argsLength; i += 1) {
      args[i] = res[$argNames[i]]
    }
    return method.apply(scope, args)
  }

  function applyArray (scope, args) {
    if (firstCall) {
      initCall()
    }

    if (!Array.isArray(args)) {
      throw new Error(`Trying to apply non-array with applyValid: ${args}`)
    }

    for (let i = 0; i < $argsLength; i += 1) {
      helperObject[$argNames[i]] = args[i]
    }

    return applyObject(scope, helperObject, args)
  }

  return {
    applyObject,
    applyArray
  }
}
