'use strict'

const { expect } = require('chai')
const assertPlugin = require('../lib/assertPlugin')

describe('filling a plugin property of options should', () => {
  it('work if no plugin object were given', done => {
    expect(assertPlugin(null, 1)).to.be.deep.equal({
      plugins: [1]
    })
    done()
  })

  it('work if a object was given', done => {
    expect(assertPlugin({}, 1)).to.be.deep.equal({
      plugins: [1]
    })
    done()
  })

  it('work if a plugins array was given', done => {
    expect(assertPlugin({
      plugins: []
    }, 1)).to.be.deep.equal({
      plugins: [1]
    })
    done()
  })

  it('work if a plugins array with that particular plugin was given', done => {
    expect(assertPlugin({
      plugins: [1]
    }, 1)).to.be.deep.equal({
      plugins: [1]
    })
    done()
  })

  it('work if a plugins array with any plugin was given', done => {
    expect(assertPlugin({
      plugins: [2]
    }, 1)).to.be.deep.equal({
      plugins: [1, 2]
    })
    done()
  })

  it('work if a plugins was given', done => {
    expect(assertPlugin({
      plugins: 2
    }, 1)).to.be.deep.equal({
      plugins: [1, 2]
    })
    done()
  })

  it('work if only the searched was given', done => {
    expect(assertPlugin({
      plugins: 1
    }, 1)).to.be.deep.equal({
      plugins: 1
    })
    done()
  })
})
