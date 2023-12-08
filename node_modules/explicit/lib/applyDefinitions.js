'use strict'

function applyDefinition (options) {
  return definition => {
    if (definition._raw) {
      return definition._rawContent
    }
    let method = definition.$
    let wraps
    for (const plugin of options.plugins) {
      const field = `$${plugin.name}`
      if (definition[field] === undefined || !plugin.augment) continue

      const newMethod = plugin.augment(definition, method)
      if (typeof newMethod !== 'function') {
        throw new Error(`Augmentation: The plugin '${plugin.name}' does not return a method.`)
      }
      if (newMethod !== method) {
        if (wraps === undefined) {
          wraps = []
        }
        wraps.unshift(method)
        method = newMethod
      }
    }
    method.$wraps = wraps
    for (const plugin of options.plugins) {
      const field = `$${plugin.name}`
      if (definition[field] === undefined) continue

      method[field] = definition[field]
      if (plugin.attach) {
        plugin.attach(definition, method)
      }
    }
    return method
  }
}

function applyDefinitionMap (definitions, localAD) {
  const result = {}
  Object.keys(definitions).forEach(name => {
    result[name] = localAD(definitions[name])
  })
  return result
}

function applyDefinitions (definitions, options) {
  const localAD = applyDefinition(options)

  if (Array.isArray(definitions)) {
    return definitions.map(localAD)
  }

  if (definitions.$one) {
    return localAD(definitions)
  }

  return applyDefinitionMap(definitions, localAD)
}

module.exports = applyDefinitions
