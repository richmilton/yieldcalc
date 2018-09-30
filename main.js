const async = require('asyncawait/async');
const await = require('asyncawait/await');
const request = require('request-promise-native');

exports.doSummary = body => {
  let p,
    fp = parseInt(body.response.listings[0] ? body.response.listings[0].price_high : '0'),
    cum = 0,
    av = 0,
    high = fp,
    low = fp,
    last = 0,
    pr = 0,
    l = body.response.listings.length;
  console.log(body.response.total_pages || 'no results found');
  console.log(l);
  for (let r = 0; r < l; r++) {
    p = body.response.listings[r];
    pr = parseInt(p.price_high),
      console.log(`[${p.datasource_name}][${p.lister_name || ''}] ${p.title} ${p.price_formatted}[${p.price_high}]`);
    cum += pr;
    if (pr < last) low = pr;
    if (pr > last) high = pr;
    last = pr
  }
  av = (cum/l || 0)
  return {hi: high, lo: low, av: av.toFixed(0), num: l};
};

exports.toQueryString = ob => {
  let qs = '';
  for (let k of Object.keys(ob)) {
    qs += `${k}=${ob[k]}&`;
  }
  return qs;
};

exports.doYield = (p, r, f) => {
  res = {price: p, rent: r, yield: (r * f / p * 100).toFixed(2)};
  return JSON.stringify(res)
  //return `price: ${p}, rent: ${r}, yield: ${(r * f / p * 100).toFixed(2)}`;
};

//module.exports = doSummary