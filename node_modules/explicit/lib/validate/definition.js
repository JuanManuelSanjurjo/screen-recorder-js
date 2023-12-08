'use strict'

const validate = require('./index')(require('../schema/definition'))

module.exports = pluginMap => definition => {
  if (typeof definition !== 'object' || definition === null || definition === undefined) {
    return {
      $one: true,
      _raw: true,
      _rawContent: definition
    }
  }
  definition = validate(definition)
  for (const plugin of pluginMap) {
    const field = `$${plugin.name}`
    definition[field] = plugin.validate(definition[field])
  }
  return definition
}
