'use strict'

const prepare = require('./prepare')
const applyDefinitions = require('./applyDefinitions')
const assertPlugin = require('./assertPlugin')
const asyncPlugin = require('../plugin/async')

function explicit (definitions, options, modify) {
  if (modify !== undefined && typeof modify !== 'function') {
    throw new Error(`Can not modify explicit definitions with: ${modify}`)
  }

  const prepared = prepare(definitions, options, modify)

  return applyDefinitions(
    prepared.definitions,
    prepared.options
  )
}

explicit.async = (definitions, options) => explicit(
  definitions,
  assertPlugin(options, asyncPlugin),
  entry => {
    entry.$async = true
  }
)

module.exports = explicit
