'use strict'

const { expect } = require('chai')
const explicit = require('..')
const noop = () => {}

describe('a regular explicit call should', () => {
  it('just pass', done => {
    expect(explicit({
      $one: true,
      $: noop
    })).to.be.equal(noop)
    done()
  })
})

describe('using explicit should allow modification of', () => {
  it('a single definitions', done => {
    const result = explicit({
      $one: true
    }, null, function (definition) {
      definition.$ = noop
    })
    expect(result).to.be.equal(noop)
    done()
  })

  it('a map of definitions', done => {
    const result = explicit({
      test: {}
    }, null, function (definition) {
      definition.$ = noop
    })
    expect(result).to.be.eql({
      test: noop
    })
    done()
  })

  it('an array of definitions', done => {
    const result = explicit([{
      $one: true
    }, {
      $one: true
    }], null, function (definition) {
      definition.$ = noop
    })
    expect(result).to.be.eql([noop, noop])
    done()
  })
})

describe('using plugins', () => {
  it("should allow 'null'", done => {
    explicit({}, { plugins: null })
    done()
  })
})

describe('using explicit should break with a', () => {
  it('number to modify something', done => {
    try {
      explicit(null, null, 1)
    } catch (e) {
      expect(e.message).to.be.equal('Can not modify explicit definitions with: 1')
      return done()
    }
    throw new Error('No exception thrown.')
  })
})
