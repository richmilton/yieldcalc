const restify = require('restify');
const main = require('../main');

function respond(req, res, next) {
  let ob = {pc: req.params.postcode};
  res.send(ob);
  next();
}

const server = restify.createServer();
server.get('/calculate/:postcode/:range/:hilo', respond);
server.head('/calculate/:postcode/:range/:hilo', respond);

//static html
server.get('/public/static/*', restify.plugins.serveStatic({

  directory: __dirname,

  default: 'index.html'

}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});