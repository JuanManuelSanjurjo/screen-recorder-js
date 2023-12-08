'use strict'

const Joi = require('@hapi/joi')

module.exports = schema => data => {
  const result = Joi.validate(data, schema)
  if (result.error) {
    throw result.error
  }
  return result.value
}
