'use strict';

const { makeId } = require('../src/utils/makeId')

describe('::: MakeId function :::', () => {
  it('#creates random string', () => {
    const result = makeId(5)
    expect(result.length).toEqual(5)
  })
})