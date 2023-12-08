'use strict'

const Joi = require('@hapi/joi')

module.exports = Joi.object({
  $: Joi.func().required(),
  $one: Joi.boolean(),
  _raw: Joi.forbidden(),
  _rawContent: Joi.forbidden(),
  _types: Joi.object()
}).unknown()
