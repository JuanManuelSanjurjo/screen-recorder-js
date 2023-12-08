'use strict'

const joi = require('@hapi/joi')
const explicit = require('../../')

function argsToArray () {
  return Array.prototype.slice.apply(arguments)
}

describe('Making sure validation works', () => {
  it('should use the new argument from the proper position', done => {
    const method = explicit({
      $one: true,
      $args: [joi.number()],
      $assert: true,
      $: argsToArray
    })
    try {
      method('a')
    } catch (e) {
      done()
      return
    }
    throw new Error('There should have been an error')
  })
})
