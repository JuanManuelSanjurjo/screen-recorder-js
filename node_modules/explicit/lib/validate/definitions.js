'use strict'

const validateDefinition = require('./definition')

function validateMap (definitions, localVD) {
  const result = {}
  Object.keys(definitions).forEach(name => {
    let entry = definitions[name]
    if (typeof entry === 'function') {
      entry = {
        $: entry
      }
    }
    result[name] = localVD(entry)
  })
  return result
}

function validateDefinitions (definitions, pluginMap) {
  const localVD = validateDefinition(pluginMap)

  if (Array.isArray(definitions)) {
    return definitions.map(localVD)
  }

  if (typeof definitions === 'object' && definitions !== null && definitions !== undefined) {
    if (definitions.$one) {
      return localVD(definitions)
    }
    return validateMap(definitions, localVD)
  }

  return localVD(definitions)
}

module.exports = validateDefinitions
