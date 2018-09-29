var expect = require('chai').expect;
var getLatLong = require('../postcode');

describe('getLatLong()', function () {
  it('should add two numbers', function () {

    // 1. ARRANGE
    var x = 5;
    var y = 1;
    var sum1 = x + y;

    // 2. ACT
    var sum2 = getLatLong(x, y);

    // 3. ASSERT
    expect(sum2).to.be.equal(sum1);

  });
});