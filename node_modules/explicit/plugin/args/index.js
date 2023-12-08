'use strict'

const validate = require('../../lib/validate')
const clone = Array.prototype.slice
const Joi = require('@hapi/joi')
const createArgValidator = require('../_util/argValidator')

module.exports = {
  name: 'args',
  validate: validate(Joi.array().default([])),
  attach (definition, method) {
    method.$args = definition.$args

    const validator = createArgValidator(method)

    method.applyValid = (scope, args) => validator.applyArray(scope, args)
    method.valid = function () {
      return method.applyValid(this, clone.apply(arguments))
    }

    method.applyObject = (scope, object) => validator.applyObject(scope, object)
    method.validObject = object => method.applyObject(this, object)
  }
}
