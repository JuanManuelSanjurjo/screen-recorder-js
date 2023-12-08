'use strict'

const validate = require('../../lib/validate')
const Joi = require('@hapi/joi')

module.exports = {
  name: 'async',
  validate: validate(Joi.boolean())
}
