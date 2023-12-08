'use strict'

const { expect } = require('chai')
const joi = require('@hapi/joi')
const explicit = require('../..')
const validate = require('../../lib/validate')

function firstKey (object) {
  var key
  for (key in object) {
    return {
      key,
      value: object[key]
    }
  }
}

function makeArray (argList) {
  return argList.map(arg => firstKey(arg).value)
}

function makeObject (argList) {
  var result = {}
  argList.forEach(function (arg) {
    arg = firstKey(arg)
    result[arg.key] = arg.value
  })
  return result
}

var matrix = {
  named: {
    named: {
      one: (name, schema) => schema.meta(name),
      many () {
        return Array.prototype.slice.apply(arguments)
      }
    },
    'not-named': {
      one: (name, schema) => schema,
      many: function () {
        const args = Array.prototype.slice.apply(arguments)
        const numberKeys = []
        args.forEach(function (entry, no) {
          Object.keys(entry).every(function (key) {
            var newVal = {}
            newVal[no] = entry[key]
            numberKeys.push(newVal)
            return true
          })
        })
        return numberKeys
      }
    }
  },
  exec: {
    applyObject: (method, argList) => method.applyObject(null, makeObject(argList)),
    applyValid: (method, argList) => method.applyValid(null, makeArray(argList)),
    valid: (method, argList) => method.valid.apply(null, makeArray(argList)),
    validObject: (method, argList) => method.validObject(makeObject(argList))
  }
}

function noop () {
  return Array.prototype.slice.apply(arguments)
}

function augment (op) {
  return explicit({ $one: true, $args: Array.prototype.slice.apply(arguments, [1]), $: op })
}

function expectInvalid (exec, method, args, done, error) {
  if (!error) {
    error = 'ValidationError'
  }
  try {
    exec(method, args)
  } catch (e) {
    expect(e.name).to.be.equal(error)
    return done()
  }
  throw new Error('Expected exception not thrown.')
}

describe('Validating arguments after they have been extended by another plugin', () => {
  it('should use the new argument from the proper position', done => {
    var method = explicit({
      $one: true,
      $args: [joi.number()],
      $test: true,
      $: noop
    }, {
      plugins: {
        name: 'test',
        validate: validate(joi.boolean()),
        attach: (definition, method) => {
          method.$args.unshift(joi.string())
        }
      }
    })

    method.valid('a', 1)
    done()
  })
})

describe('Validating an array', () => {
  it("should fail if the argument isn't an array - doh", done => {
    const method = explicit({
      $one: true,
      $args: [],
      $: noop
    })

    expectInvalid((method, arg) => method.applyValid(null, arg), method, 'a', done, 'Error')
  })
})

function addMatrix (title, meta, exec) {
  var isObject = exec === matrix.exec.validObject || exec === matrix.exec.applyObject
  var isNamed = meta === matrix.named.named

  describe(`Validating ${title} arguments`, () => {
    if (!(isObject && !isNamed)) {
      it('should pass the arguments', done => {
        const method = augment(noop, meta.one('a', joi.any()))

        expect(exec(method, meta.many({ a: 'foo' }))).to.deep.equal(['foo'])
        done()
      })
    }

    it('should validate the arguments', done => {
      const method = augment(noop, meta.one('a', joi.number()))

      expectInvalid(exec, method, meta.many({ a: 'ho' }), done)
    })

    it('should validate the arguments also the second time', done => {
      const method = augment(noop, meta.one('a', joi.number()))

      expectInvalid(exec, method, meta.many({ a: 'ho' }), function () {
        exec(method, [])
        done()
      })
    })

    it('should not require a not-required argument', done => {
      const method = augment(noop, meta.one('a', joi.any()))

      exec(method, [])
      done()
    })

    it('should require a required argument', done => {
      const method = augment(noop, meta.one('a', joi.any()).required())

      expectInvalid(exec, method, [], done)
    })

    if (!isObject) {
      it('should allow additional arguments', done => {
        const method = augment(noop, meta.one('a', joi.any()))

        expect(exec(method, meta.many({ a: 1 }, { 1: 2 }))).to.be.deep.equal([1, 2])
        done()
      })
    }
    if (isObject && isNamed) {
      it('should allow unknown arguments', done => {
        const method = augment(noop, meta.one('a', joi.any()))

        expect(exec(method, meta.many({ a: 1 }, { b: 2 }))).to.be.deep.equal([1])
        done()
      })
    }
  })
}

function setupTestMatrix () {
  Object.keys(matrix.named).forEach(nKey => {
    Object.keys(matrix.exec).forEach(eKey => {
      addMatrix(`${nKey} arguments with '.${eKey}'`, matrix.named[nKey], matrix.exec[eKey])
    })
  })
}

setupTestMatrix()
