const expect = require('chai').expect;
const priceData = require('./data/price.json.js');
const rentData = require('./data/rent.json.js');
const main = require('../main');

describe('doSummary()', function () {
  it('should return json {hi: high, lo: low, av: av.toFixed(0), num: l}', function () {

    let result = main.doSummary(priceData);

    // 3. ASSERT
    expect(result.hi).to.be.equal(770000);
    expect(result.lo).to.be.equal(210000);
    expect(result.av).to.be.equal('446950');
    expect(result.num).to.be.equal(20);

  });
});

describe('doSummary()', function () {
  it('should return json {hi: high, lo: low, av: av.toFixed(0), num: l}', function () {

    let result = main.doSummary(rentData);

    // 3. ASSERT
    expect(result.hi).to.be.equal(2300);
    expect(result.lo).to.be.equal(895);
    expect(result.av).to.be.equal('1208');
    expect(result.num).to.be.equal(16);

  });
});