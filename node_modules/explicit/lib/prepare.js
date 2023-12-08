'use strict'

const validateDefinitions = require('./validate/definitions')
const validateOptions = require('./validate/options')
const assertPlugin = require('./assertPlugin')
const PluginMap = require('./PluginMap')
const argsPlugin = require('../plugin/args')
const assertPlugin2 = require('../plugin/assert')

function prepareDefinitions (definitions, options, modify) {
  if (modify) {
    if (Array.isArray(definitions)) {
      definitions.forEach(modify)
    } else if (definitions.$one) {
      modify(definitions)
    } else {
      Object.keys(definitions).forEach(key => modify(definitions[key]))
    }
  }
  definitions = validateDefinitions(definitions, options.plugins)
  return definitions
}

function prepareOptions (options) {
  options = assertPlugin(options, argsPlugin)
  options = assertPlugin(options, assertPlugin2)
  options = validateOptions(options)
  options.plugins = new PluginMap(options.plugins)
  return options
}

module.exports = function (definitions, options, modify) {
  options = prepareOptions(options)
  return {
    definitions: prepareDefinitions(definitions, options, modify),
    options
  }
}
