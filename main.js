//const async = require('asyncawait/async');
//const await = require('asyncawait/await');
const request = require('request-promise-native');
const getLatLong = require('./postcode');

const doSummary = body => {
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

const toQueryString = ob => {
  let qs = '';
  for (let k of Object.keys(ob)) {
    qs += `${k}=${ob[k]}&`;
  }
  return qs;
};

const doYield = (p, r, f) => {
  res = {price: p, rent: r, yield: (r * f / p * 100).toFixed(2)};
  return res;
  //return `price: ${p}, rent: ${r}, yield: ${(r * f / p * 100).toFixed(2)}`;
};

async function calculate(postcode, range) {
  let numBeds = 2,
    buySum,
    rentSum,
    sort = 'ph',
    wkOrMnth = 12,
    sortOpts = {
      re: 'relevancy',
      bl: 'bedroom_lowhigh',
      bh: 'bedroom_highlow',
      pl: 'price_lowhigh',
      ph: 'price_highlow',
      ne: 'newest',
      ol: 'oldest',
      rm: 'random',
      di: 'distance'
    },
    stuff = {
      encoding: 'json',
      pretty: '1',
      action: 'search_listings',
      country: 'uk',
      //place_name: 'BS7',
      //centre_point: '51.475366,-2.598308,1.0mi',
      number_of_results: '50',
      bedroom_min: numBeds,
      bedroom_max: numBeds,
      property_type: 'flat',
      listing_type: 'buy',
      radius: 5,
      sort: sortOpts[sort]
    },
    urlPrefix = 'https://api.nestoria.co.uk/api?',
    pProm,
    rProm,
    pcData, wait = ms => new Promise((r, j)=>setTimeout(r, ms));

  pcData = await getLatLong(postcode);
  stuff.centre_point = `${pcData.result.latitude},${pcData.result.longitude},${range}`;

  console.log(stuff.centre_point);

  bqs = urlPrefix + toQueryString(stuff);
  stuff.listing_type = 'rent';
  rqs = urlPrefix + toQueryString(stuff);

  console.log(bqs)
  console.log(rqs)

  pProm = await request(bqs, { json: true });
  rProm = await wait(1000);
  rProm = await request(rqs, { json: true });

  buySum = doSummary(pProm);
  rentSum = doSummary(rProm);

  console.log(`${stuff.bedroom_min} bed ${stuff.property_type}s ${postcode}`);
  console.log('Properties for sale analysed: ' + buySum.num);
  console.log('Properties for rent analysed: ' + rentSum.num);
  console.log('Average price: ' + buySum.av);
  console.log('Average rent: ' + rentSum.av);
  console.log('Highest price: ' + buySum.hi);
  console.log('Highest rent: ' + rentSum.hi);
  console.log('Lowest price: ' + buySum.lo);
  console.log('Lowest rent: ' + rentSum.lo);
  console.log('Yield on lowest: ' + doYield(buySum.lo, rentSum.lo, wkOrMnth));
  console.log('Yield on highest: ' + doYield(buySum.hi, rentSum.hi, wkOrMnth));
  console.log('Average yield estimate: ' + JSON.stringify(doYield(buySum.av, rentSum.av, wkOrMnth)));
}

exports.doSummary = doSummary;
exports.doYield = doYield;
exports.toQueryString = toQueryString;
exports.calculate = calculate;