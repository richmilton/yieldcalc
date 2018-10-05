/*
  Uses https://postcodes.io/ api to find lat/long readings
  for UK a post code or partial post code
*/

const request = require('request-promise-native');
const apiUrlPrefix = 'https://postcodes.io/postcodes/'

let getLatLong = (postCode) => {
  //return request(apiUrlPrefix + postCode, {json: true});
  return new Promise((resolve, reject) => {
    request(apiUrlPrefix + postCode, {json: true}).then(data => {
      resolve(data);
    }).catch(err => {
      reject(err.error);
    });
  })
}

module.exports = getLatLong;