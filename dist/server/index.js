'use strict';

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _connector = require('../controllers/connector');

var _connector2 = _interopRequireDefault(_connector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setup Restify Server
var server = _restify2.default.createServer();

server.post('/api/messages', _connector2.default.listen());

server.listen(process.env.PORT, function () {
  console.log('%s listening to %s', server.name, server.url);
});