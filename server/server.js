const restify = require('restify');
const main = require('../main');

function respond(req, res, next) {
  let ob = {pc: req.params.postcode};
  res.send(ob);
  next();
}

const doCalc = (req, res, next) => {
  main.calculate(
    req.params.postcode,
    req.params.range,
    req.params.hilo,
    req.params.beds,
    req.params.ptype).then(
    resp => {
      res.send(resp);
      next();
    },
    rej => {
      res.send(rej);
      console.log('server', rej);
      next();
    }
  )
}

const server = restify.createServer();
server.get('/calculate/:postcode/:range/:hilo/:beds/:ptype', doCalc);
server.head('/calculate/:postcode/:range/:hilo/:beds/:ptype', respond);

//static html
server.get('/public/static/*', restify.plugins.serveStatic({
  directory: __dirname,
  default: 'index.html'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});