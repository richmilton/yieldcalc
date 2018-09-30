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

describe('doYield()', function () {
  it('should return json', function () {

    let priceRes = main.doSummary(priceData);
    let rentRes = main.doSummary(rentData);
    let result = main.doYield(priceRes.hi, rentRes.hi, 12);

    // 3. ASSERT
    expect(result.price).to.be.equal(770000);
    expect(result.rent).to.be.equal(2300);
    expect(result.yield).to.be.equal('3.58');
  });
});

describe('calculate()', function () {
  it('should return ?', function () {

    let result = main.calculate('BS7 8DR','2.0mi');

    // 3. ASSERT
    expect(result.price).to.be.equal(770000);
    expect(result.rent).to.be.equal(2300);
    expect(result.yield).to.be.equal('3.58');
  });
});