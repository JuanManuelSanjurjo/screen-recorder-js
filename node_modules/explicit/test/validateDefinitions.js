'use strict'

const { expect } = require('chai')
const validateDefinitions = require('../lib/validate/definitions')

const noop = () => {}

function validate (before, after) {
  expect(validateDefinitions(before, [])).to.deep.equal(after)
}

function validateAll (entries) {
  entries.forEach(function (tuple) { validate(tuple[0], tuple[1]) })
}

describe('Validation of definitions', () => {
  it('should just pass variables', done => {
    validateAll([
      [1, { $one: true, _raw: true, _rawContent: 1 }],
      [true, { $one: true, _raw: true, _rawContent: true }],
      [false, { $one: true, _raw: true, _rawContent: false }],
      ['hello', { $one: true, _raw: true, _rawContent: 'hello' }],
      [noop, { $one: true, _raw: true, _rawContent: noop }]
    ])
    validate(null, { $one: true, _raw: true, _rawContent: null })
    validate(undefined, { $one: true, _raw: true, _rawContent: undefined })
    done()
  })

  it('should accept regular entries', done => {
    validate({}, {})
    validate({
      $one: true,
      $: noop
    }, {
      $one: true,
      $: noop
    })
    validate({
      a: 1,
      test: noop
    }, {
      a: { $one: true, _raw: true, _rawContent: 1 },
      test: { $: noop }
    })
    validate({
      test: { $: noop }
    }, {
      test: { $: noop }
    })
    done()
  })

  it('should break invalid names', done => {
    try {
      validateDefinitions({ $one: true, $: 'hi' })
    } catch (e) {
      expect(e.name).to.be.equal('ValidationError')
      return done()
    }
    throw new Error("Shouldn't reach here")
  })

  it('should accept arrays', done => {
    validate([], [])
    validate([{
      $: noop
    }], [{
      $: noop
    }])
    done()
  })

  it('should validate plugins', done => {
    var result = validateDefinitions({
      test: {
        $test: 1,
        $: noop
      }
    }, [{
      name: 'test',
      validate: value => {
        expect(value).to.equals(1)
        return 2
      }
    }])
    expect(result).to.deep.equals({
      test: {
        $test: 2,
        $: noop
      }
    })
    done()
  })

  it('should still validate unused plugins', done => {
    const result = validateDefinitions({
      test: {
        $: noop
      }
    }, [{
      name: 'test',
      validate: function (value) {
        expect(value).to.eql(undefined)
        return 2
      }
    }])
    expect(result).to.deep.equals({
      test: {
        $: noop,
        $test: 2
      }
    })
    done()
  })
})
