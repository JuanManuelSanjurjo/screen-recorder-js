'use strict'

const Joi = require('@hapi/joi')

module.exports = Joi.object({
  name: Joi.string().required(),
  validate: Joi.func().required(),
  augment: Joi.func()
}).strict()
