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
    l = body.response.listings.length,
    propList =[];
  console.log(body.response.total_pages || 'no results found');
  console.log(l);
  for (let r = 0; r < l; r++) {
    p = body.response.listings[r];
    pr = parseInt(p.price_high);
    propList.push(p);
    //propList.push(`[${p.datasource_name}][${p.lister_name || ''}] ${p.title} ${p.price_formatted}[${p.price_high}]`);
    cum += pr;
    if (pr < last) low = pr;
    if (pr > last) high = pr;
    last = pr
  }
  av = (cum/l || 0)
  return {hi: high, lo: low, av: av.toFixed(0), num: l, properties: propList};
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

async function calculate(postcode, range, hilo, beds, ptype) {
  let numBeds = beds,
    buySum,
    rentSum,
    sort = hilo,
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
      property_type: ptype,
      listing_type: 'buy',
      radius: 5,
      sort: sortOpts[sort]
    },
    urlPrefix = 'https://api.nestoria.co.uk/api?',
    pcData,
    err,
    wait = ms => new Promise((r, j)=>setTimeout(r, ms));

  pcData = await getLatLong(postcode);

  stuff.centre_point = `${pcData.result.latitude},${pcData.result.longitude},${range}`;

  console.log(stuff.centre_point);

  bqs = urlPrefix + toQueryString(stuff);
  stuff.listing_type = 'rent';
  rqs = urlPrefix + toQueryString(stuff);

  console.log(bqs)
  console.log(rqs)

  return new Promise(async (resolve, reject) => {
    let pProm,
      rProm;

    pProm = await request(bqs, { json: true });

    if (pProm.response.listings.length === 0) {
      reject({status: 500, error: 'no properties found for sale'});
    }

    rProm = await wait(1000);
    rProm = await request(rqs, { json: true });

    if (rProm.response.listings.length === 0) {
      reject({status: 500, error: 'no properties found for rent'});
    }

    buySum = doSummary(pProm);
    rentSum = doSummary(rProm);

    resolve({
      title: `${stuff.bedroom_min} bed ${stuff.property_type}s ${postcode}`,
      latlng: {lat: pcData.result.latitude, lng: pcData.result.longitude},
      sales_analysed: buySum.num,
      rents_analysed: rentSum.num,
      average_sale_price: buySum.av,
      average_rent_price: rentSum.av,
      highest_sale_price: buySum.hi,
      highest_rent_price: rentSum.hi,
      lowest_sale_price: buySum.lo,
      lowest_rent_price: rentSum.lo,
      yield_on_lowest: doYield(buySum.lo, rentSum.lo, wkOrMnth),
      yield_on_highest: doYield(buySum.hi, rentSum.hi, wkOrMnth),
      average_yield_estimate: doYield(buySum.av, rentSum.av, wkOrMnth),
      properties_for_sale: buySum.properties,
      properties_for_rent: rentSum.properties
    });

  });
}

module.exports.doSummary = doSummary;
module.exports.doYield = doYield;
module.exports.toQueryString = toQueryString;
module.exports.calculate = calculate;