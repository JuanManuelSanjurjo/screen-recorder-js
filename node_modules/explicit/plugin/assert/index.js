'use strict'

const validate = require('../../lib/validate')
const clone = Array.prototype.slice
const Joi = require('@hapi/joi')
const createArgValidator = require('../_util/argValidator')

module.exports = {
  name: 'assert',
  validate: validate(Joi.boolean().default(false)),
  augment (definition, method) {
    if (!definition.$assert) {
      return method
    }
    method.$args = definition.$args

    const validator = createArgValidator(method)

    return function () {
      return validator.applyArray(this, clone.apply(arguments))
    }
  }
}
