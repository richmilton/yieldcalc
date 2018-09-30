/*
  Uses https://postcodes.io/ api to find lat/long readings
  for UK a post code or partial post code
*/

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const request = require('request-promise-native');
const apiUrlPrefix = 'https://postcodes.io/postcodes/'

async function getLatLong(postCode) {
  return await request(apiUrlPrefix + postCode, {json: true});
}

module.exports = getLatLong;