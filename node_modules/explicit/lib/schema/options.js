'use strict'

const Joi = require('@hapi/joi')
const PluginNoName = Joi.object({
  validate: Joi.func().required(),
  augment: Joi.func(),
  attach: Joi.func()
})
const Plugin = PluginNoName.keys({
  name: Joi.string().required()
})

module.exports = Joi.object({
  plugins: Joi.alternatives().try(
    Joi.array().items(Plugin, Joi.string()),
    Plugin
  ).default([])
}).strict()
