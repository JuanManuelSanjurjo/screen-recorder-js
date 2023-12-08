'use strict'

class PluginMap extends Array {
  constructor (plugins) {
    super()
    const map = {}
    if (plugins !== undefined) {
      if (!Array.isArray(plugins)) {
        plugins = [plugins]
      }
      for (const plugin of plugins) {
        this.push(plugin)
        map[plugin.name] = plugin
      }
    }

    this.pluginMap = map
  }
}

module.exports = PluginMap
