'use strict'

const { expect } = require('chai')
const explicit = require('../..')
const noop = () => {}

describe('Async definitions', () => {
  it('should be marked async', done => {
    expect(explicit.async({
      $one: true,
      $: noop
    }).$async).to.equal(true)
    done()
  })
})
