var expect = require('chai').expect;
var getLatLong = require('../postcode');

describe('getLatLong()', function () {
  it('should return lat,long', function () {

    // 1. ARRANGE
    let postcode = 'BS7 8DR';

    // 2. ACT
    let result = getLatLong(postcode);

    // 3. ASSERT
    result.then(r => {
      expect(r.status).to.be.equal(200);
      expect(r.result.longitude).to.be.equal(-2.598308);
      expect(r.result.latitude).to.be.equal(51.475366);
    })

  });
});

describe('getLatLong()', function () {
  it('should return error', function () {

    // 1. ARRANGE
    let postcode = 'BS1 1AA', err, result;

    // 2. ACT
    result = getLatLong(postcode);

    //console.log(result);

    // 3. ASSERT
    result.then((data) => {
      console.log(data)
      //expect(res.result.longitude).to.be.equal(-2.598308);

    }).catch(err => {
      expect(err.status).to.be.equal(404);
    });

  });
});
